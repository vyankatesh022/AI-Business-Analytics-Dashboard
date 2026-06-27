export interface WorkspaceFolder {
  id: string;
  name: string;
  parentId?: string | null;
  colorLabel?: string | null;
  description?: string | null;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceDataset {
  id: string;
  name: string;
  folderId?: string | null;
  description?: string | null;
  tags?: string[];
  status: string;
  format?: string | null;
  sizeBytes?: number | null;
  rowCount?: number | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceConnection {
  id: string;
  name: string;
  folderId?: string | null;
  type: string;
  host?: string | null;
  port?: number | null;
  databaseName?: string | null;
  username?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type WorkspaceNode = 
  | { type: 'folder'; data: WorkspaceFolder; children: WorkspaceNode[] }
  | { type: 'dataset'; data: WorkspaceDataset }
  | { type: 'connection'; data: WorkspaceConnection };
