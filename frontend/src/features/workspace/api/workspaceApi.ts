import { WorkspaceFolder, WorkspaceDataset, WorkspaceConnection } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1/workspace';

// --- MOCK STATE FOR UI DEVELOPMENT ---
// Since the backend is disabled for the UI phase, we mock the data store in memory
let mockFolders: WorkspaceFolder[] = [];
let mockDatasets: WorkspaceDataset[] = [];
let mockConnections: WorkspaceConnection[] = [];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const workspaceApi = {
  // Folders
  getFolders: async (parentId?: string | null): Promise<WorkspaceFolder[]> => {
    await delay(300);
    return mockFolders.filter(f => (f.parentId || null) === (parentId || null));
  },
  createFolder: async (data: any): Promise<WorkspaceFolder> => {
    await delay(300);
    const newFolder: WorkspaceFolder = {
      id: Math.random().toString(36).substring(2, 15),
      name: data.name || 'New Folder',
      parentId: data.parent_id || data.parentId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockFolders.push(newFolder);
    return newFolder;
  },
  updateFolder: async (id: string, data: any): Promise<WorkspaceFolder> => {
    await delay(300);
    const index = mockFolders.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Folder not found');
    mockFolders[index] = { ...mockFolders[index], ...data, updatedAt: new Date().toISOString() };
    return mockFolders[index];
  },
  deleteFolder: async (id: string): Promise<void> => {
    await delay(300);
    mockFolders = mockFolders.filter(f => f.id !== id);
    // Note: Recursive deletion not mocked in UI phase, but filtered out here
  },

  // Datasets
  getDatasets: async (folderId?: string | null): Promise<WorkspaceDataset[]> => {
    await delay(300);
    return mockDatasets.filter(d => (d.folderId || null) === (folderId || null));
  },
  createDataset: async (data: any): Promise<WorkspaceDataset> => {
    // We now expect data.file to be the actual File object
    const file: File | undefined = data.file;
    
    if (file) {
      // Lazy load supabase client to avoid crashing if env vars are missing
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      // Get current user session
      let userId = 'test-user-123'; // Fallback for UI Dev phase
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.id) userId = userData.user.id;
      } catch (err) {
        console.warn('Supabase auth fetch failed:', err);
      }
      
      const folderId = data.folder_id || data.folderId || 'root';
      const filePath = `${userId}/${folderId}/${file.name}`;
      
      // Attempt to upload to Supabase Storage bucket 'workspace-files'
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('workspace-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) {
          console.warn('Supabase upload error (bypassed for UI dev):', uploadError);
        }
      } catch (err) {
        console.warn('Supabase storage fetch failed (bypassed for UI dev):', err);
      }
    } else {
      await delay(300);
    }

    const newDataset: WorkspaceDataset = {
      id: Math.random().toString(36).substring(2, 15),
      name: data.name || 'New Dataset',
      folderId: data.folder_id || data.folderId || null,
      sizeBytes: data.size_bytes || data.sizeBytes || null,
      format: data.format || null,
      status: data.status || 'ACTIVE',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDatasets.push(newDataset);
    return newDataset;
  },
  updateDataset: async (id: string, data: any): Promise<WorkspaceDataset> => {
    await delay(300);
    const index = mockDatasets.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Dataset not found');
    mockDatasets[index] = { ...mockDatasets[index], ...data, updatedAt: new Date().toISOString() };
    return mockDatasets[index];
  },
  deleteDataset: async (id: string): Promise<void> => {
    await delay(300);
    mockDatasets = mockDatasets.filter(d => d.id !== id);
  },

  // Connections
  getConnections: async (folderId?: string | null): Promise<WorkspaceConnection[]> => {
    await delay(300);
    return mockConnections.filter(c => (c.folderId || null) === (folderId || null));
  },
  createConnection: async (data: any): Promise<WorkspaceConnection> => {
    await delay(300);
    const newConn: WorkspaceConnection = {
      id: Math.random().toString(36).substring(2, 15),
      name: data.name || 'New Connection',
      folderId: data.folder_id || data.folderId || null,
      type: data.type || 'postgres',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockConnections.push(newConn);
    return newConn;
  },
};
