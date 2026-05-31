export interface DatasetMetadata {
  columns: string[];
  dtypes: Record<string, string>;
  sample: Record<string, any>[];
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
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const uploadDataset = async (file: File): Promise<Dataset> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/datasets/upload`, {
    method: 'POST',
    // Let the browser set Content-Type to multipart/form-data with boundary
    // Do NOT set Content-Type header manually here
    body: formData,
    headers: {
      // Add Authorization if needed (e.g., from local storage or cookie)
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to upload dataset');
  }

  return res.json();
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

export const analyzeDataset = async (datasetId: string, model: string = 'heuristic'): Promise<any> => {
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

export const cleanDataset = async (datasetId: string, operations: any[]): Promise<any> => {
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

