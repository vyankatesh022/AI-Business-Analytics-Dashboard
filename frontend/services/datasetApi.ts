export interface DatasetMetadata {
  columns: string[];
  dtypes: Record<string, string>;
  sample: Record<string, unknown>[];
}

export interface FolderNode {
  id: string;
  user_id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

export interface Dataset {
  id: string;
  user_id: string;
  filename: string;
  original_filename: string;
  size_bytes: number;
  row_count: number;
  column_count: number;
  metadata: DatasetMetadata;
  status: string;
  folder_id?: string | null;

  created_at: string;
  updated_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const uploadDataset = (
  file: File,
  folderId?: string | null,
  onProgress?: (progress: number) => void
): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folder_id', folderId);
    }

    const xhr = new XMLHttpRequest();
    // Bypass Next.js proxy for multipart file uploads to prevent stream consumption/limit issues
    // Use the current hostname to ensure cross-origin cookies (like mock auth) match the domain
    const baseUrl = API_BASE_URL === '/api' ? `http://${window.location.hostname}:8000/api` : API_BASE_URL;
    xhr.open('POST', `${baseUrl}/datasets/upload`, true);
    
    // Enable cross-origin cookies for mock auth to work
    xhr.withCredentials = true;


    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error('Failed to parse upload response'));
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          reject(new Error(errorResponse.detail || 'Failed to upload dataset'));
        } catch (e) {
          reject(new Error('Failed to upload dataset'));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred during upload'));
    };

    xhr.send(formData);
  });
};

export const fetchDatasets = async (): Promise<Dataset[]> => {
  const res = await fetch(`${API_BASE_URL}/datasets/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to fetch datasets');
  }

  const data = await res.json();
  return data.datasets;
};

export const deleteDataset = async (datasetId: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to delete dataset');
  }
};

export const renameDataset = async (datasetId: string, newName: string): Promise<Dataset> => {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}/rename`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ new_name: newName }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to rename dataset');
  }

  return res.json();
};

export const analyzeDataset = async (datasetId: string, model: string = 'heuristic'): Promise<unknown> => {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}/cleaning/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to analyze dataset');
  }

  return res.json();
};

export const cleanDataset = async (datasetId: string, operations: unknown[]): Promise<unknown> => {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}/cleaning/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ operations })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to apply cleaning operations');
  }

  return res.json();
};

export const fetchFolders = async (): Promise<FolderNode[]> => {
  const res = await fetch(`${API_BASE_URL}/datasets/folders`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to fetch folders');
  const data = await res.json();
  return data.folders || [];
};

export const createFolder = async (name: string, parentId?: string | null): Promise<FolderNode> => {
  const res = await fetch(`${API_BASE_URL}/datasets/folders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, parent_id: parentId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create folder');
  }
  return res.json();
};

export const renameFolder = async (folderId: string, name: string): Promise<FolderNode> => {
  const res = await fetch(`${API_BASE_URL}/datasets/folders/${folderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to rename folder');
  }
  return res.json();
};

export const deleteFolder = async (folderId: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/datasets/folders/${folderId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete folder');
  }
};

export const moveDataset = async (datasetId: string, folderId: string | null): Promise<Dataset> => {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder_id: folderId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to move dataset');
  }
  return res.json();
};

