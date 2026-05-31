import fs from 'fs';
import path from 'path';

// Define the shape of our mock user
export interface MockUser {
  id: string;
  email: string;
  password?: string; // Stored in plain text only for this local mock!
  created_at: string;
}

const getDbPath = () => path.join(process.cwd(), 'local-users.json');

// Ensure this utility is absolutely never invoked in a production environment
const ensureDevMode = () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error("SECURITY FAULT: Mock Database invoked in production environment!");
  }
};

export const getMockUsers = (): MockUser[] => {
  ensureDevMode();
  const dbPath = getDbPath();
  if (!fs.existsSync(dbPath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const saveMockUsers = (users: MockUser[]) => {
  ensureDevMode();
  const dbPath = getDbPath();
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
};

export const findMockUserByEmail = (email: string): MockUser | undefined => {
  const users = getMockUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const createMockUser = (email: string, password?: string): MockUser => {
  ensureDevMode();
  const users = getMockUsers();
  
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("User already exists");
  }

  const newUser: MockUser = {
    id: `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email,
    password,
    created_at: new Date().toISOString()
  };

  users.push(newUser);
  saveMockUsers(users);

  return newUser;
};
