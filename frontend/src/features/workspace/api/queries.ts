import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceApi } from './workspaceApi';
import { WorkspaceFolder, WorkspaceDataset, WorkspaceConnection } from '../types';

// Keys
export const workspaceKeys = {
  all: ['workspace'] as const,
  folders: (parentId?: string | null) => [...workspaceKeys.all, 'folders', parentId] as const,
  datasets: (folderId?: string | null) => [...workspaceKeys.all, 'datasets', folderId] as const,
  connections: (folderId?: string | null) => [...workspaceKeys.all, 'connections', folderId] as const,
};

// Queries
export const useWorkspaceFolders = (parentId?: string | null) => {
  return useQuery({
    queryKey: workspaceKeys.folders(parentId),
    queryFn: () => workspaceApi.getFolders(parentId),
  });
};

export const useWorkspaceDatasets = (folderId?: string | null) => {
  return useQuery({
    queryKey: workspaceKeys.datasets(folderId),
    queryFn: () => workspaceApi.getDatasets(folderId),
  });
};

export const useWorkspaceConnections = (folderId?: string | null) => {
  return useQuery({
    queryKey: workspaceKeys.connections(folderId),
    queryFn: () => workspaceApi.getConnections(folderId),
  });
};

// Mutations
export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workspaceApi.createFolder,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.folders(variables.parentId) });
    },
  });
};

export const useCreateDataset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workspaceApi.createDataset,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.datasets(variables.folderId) });
    },
  });
};

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => workspaceApi.updateFolder(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.folders(variables.data.parentId) });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => workspaceApi.deleteFolder(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.folders() });
    },
  });
};

export const useUpdateDataset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => workspaceApi.updateDataset(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.datasets(variables.data.folderId) });
    },
  });
};

export const useDeleteDataset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => workspaceApi.deleteDataset(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.datasets() });
    },
  });
};

export const useCreateConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workspaceApi.createConnection,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.connections(variables.folderId) });
    },
  });
};
