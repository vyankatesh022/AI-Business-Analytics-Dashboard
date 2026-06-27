"use client";

import React, { useState, useRef } from 'react';
import { 
  Database, 
  FileText, 
  Activity, 
  Zap, 
  Search, 
  Filter, 
  RefreshCw, 
  FolderPlus, 
  CloudUpload, 
  Globe,
  ChevronRight,
  Folder,
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
  Check
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { DatasetDetail } from '@/features/workspace/components/dataset-detail';
import { useQueryClient } from '@tanstack/react-query';

import { 
  useWorkspaceFolders, 
  useWorkspaceDatasets, 
  useWorkspaceConnections,
  useCreateFolder, 
  useCreateDataset,
  useCreateConnection,
  useUpdateFolder,
  useDeleteFolder,
  useUpdateDataset,
  useDeleteDataset
} from '@/features/workspace/api/queries';

// Helper for dynamic file size formatting
const formatBytes = (bytes: number | null | undefined, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function WorkspacePage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'folders' | 'datasets' | 'connections'>('all');

  const filterTrigger = React.useMemo(() => (
    <button className={cn(buttonVariants({ variant: "outline", size: "icon" }), "h-8 w-8 shrink-0 text-slate-600 border-slate-200")} />
  ), []);

  const newFolderTrigger = React.useMemo(() => (
    <button className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 text-xs shrink-0 font-medium border-slate-200 text-slate-700")} />
  ), []);

  const connectTrigger = React.useMemo(() => (
    <button className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 text-xs shrink-0 font-medium border-slate-200 text-slate-700")} />
  ), []);

  const rowMenuTrigger = React.useMemo(() => (
    <button className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-slate-400 hover:text-slate-600")} />
  ), []);
  
  // Navigation State
  const [currentPath, setCurrentPath] = useState<{id: string | null, name: string}[]>([{ id: null, name: 'Home' }]);
  const currentFolderId = currentPath[currentPath.length - 1].id;

  // New Folder State
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Rename State
  const [renameItem, setRenameItem] = useState<{ type: 'folder' | 'dataset', id: string, name: string } | null>(null);
  const [renameInput, setRenameInput] = useState('');

  // Delete State
  const [deleteItem, setDeleteItem] = useState<{ type: 'folder' | 'dataset', id: string, name: string } | null>(null);

  // Connect State
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [connectionName, setConnectionName] = useState('');
  const [connectionType, setConnectionType] = useState('postgres');
  const [connectionUrl, setConnectionUrl] = useState('');
  const [connectionKey, setConnectionKey] = useState('');

  // Selected Dataset State
  const [selectedDataset, setSelectedDataset] = useState<any>(null);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data Fetching
  const { data: folders, isLoading: foldersLoading } = useWorkspaceFolders(currentFolderId);
  const { data: datasets, isLoading: datasetsLoading } = useWorkspaceDatasets(currentFolderId);
  const { data: connections, isLoading: connectionsLoading } = useWorkspaceConnections(currentFolderId);
  
  // Mutations
  const createFolderMutation = useCreateFolder();
  const createDatasetMutation = useCreateDataset();
  const createConnectionMutation = useCreateConnection();
  const updateFolderMutation = useUpdateFolder();
  const deleteFolderMutation = useDeleteFolder();
  const updateDatasetMutation = useUpdateDataset();
  const deleteDatasetMutation = useDeleteDataset();

  // Handlers
  const handleNavigateToFolder = (folderId: string, folderName: string) => {
    setCurrentPath([...currentPath, { id: folderId, name: folderName }]);
  };

  const handleNavigateUp = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolderMutation.mutate(
      // Pass both camelCase for React Query invalidation and snake_case for backend
      { name: newFolderName, parentId: currentFolderId, parent_id: currentFolderId } as any,
      {
        onSuccess: () => {
          setIsNewFolderOpen(false);
          setNewFolderName('');
        }
      }
    );
  };

  const handleCreateConnection = () => {
    if (!connectionName.trim()) return;
    createConnectionMutation.mutate(
      { name: connectionName, type: connectionType, url: connectionUrl, key: connectionKey, folderId: currentFolderId, folder_id: currentFolderId } as any,
      {
        onSuccess: () => {
          setIsConnectOpen(false);
          setConnectionName('');
          setConnectionType('postgres');
          setConnectionUrl('');
          setConnectionKey('');
          toast.success(`Connection created successfully`);
        }
      }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // Immediately reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (!file) return;

    // Validation
    const allowedExtensions = ['csv', 'json', 'xlsx', 'xls', 'pdf', 'txt', 'md'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast.error('Invalid file type', {
        description: 'Please upload CSV, JSON, Excel, PDF, or text files.'
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast.error('File too large', {
        description: 'Maximum upload size is 50MB.'
      });
      return;
    }

    createDatasetMutation.mutate(
      // Pass both camelCase for React Query invalidation and snake_case for backend
      {
        name: file.name,
        folderId: currentFolderId,
        folder_id: currentFolderId,
        sizeBytes: file.size,
        size_bytes: file.size,
        format: fileExtension,
        status: 'ACTIVE',
        file: file // <--- Pass the actual binary File object
      } as any,
      {
        onSuccess: () => {
          toast.success(`Uploaded ${file.name} successfully`);
        },
        onError: (err: any) => {
          toast.error(`Failed to upload ${file.name}`, {
            description: err.message || 'An error occurred during upload.'
          });
        }
      }
    );
  };

  const openRenameModal = (type: 'folder' | 'dataset', id: string, currentName: string) => {
    setRenameItem({ type, id, name: currentName });
    setRenameInput(currentName);
  };

  const handleRenameItem = () => {
    if (!renameItem || !renameInput.trim()) return;
    
    if (renameItem.type === 'folder') {
      updateFolderMutation.mutate(
        { id: renameItem.id, data: { name: renameInput, parentId: currentFolderId, parent_id: currentFolderId } },
        { onSuccess: () => setRenameItem(null) }
      );
    } else {
      updateDatasetMutation.mutate(
        { id: renameItem.id, data: { name: renameInput, folderId: currentFolderId, folder_id: currentFolderId } },
        { onSuccess: () => setRenameItem(null) }
      );
    }
  };

  const handleDeleteItem = () => {
    if (!deleteItem) return;
    
    if (deleteItem.type === 'folder') {
      deleteFolderMutation.mutate(
        { id: deleteItem.id },
        { onSuccess: () => setDeleteItem(null) }
      );
    } else {
      deleteDatasetMutation.mutate(
        { id: deleteItem.id },
        { onSuccess: () => setDeleteItem(null) }
      );
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries();
    toast.success('Workspace refreshed');
  };

  const isLoading = foldersLoading || datasetsLoading || connectionsLoading;
  const isTrulyEmpty = !isLoading && (!folders || folders.length === 0) && (!datasets || datasets.length === 0) && (!connections || connections.length === 0);

  // Filtering
  const filteredFolders = folders?.filter(f => 
    (filterType === 'all' || filterType === 'folders') &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredDatasets = datasets?.filter(d => 
    (filterType === 'all' || filterType === 'datasets') &&
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConnections = connections?.filter(c => 
    (filterType === 'all' || filterType === 'connections') &&
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSearchEmpty = !isTrulyEmpty && 
    (!filteredFolders || filteredFolders.length === 0) && 
    (!filteredDatasets || filteredDatasets.length === 0) && 
    (!filteredConnections || filteredConnections.length === 0);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
          Data Ingestion Command Center
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Index, organize, ingest, and monitor datasets from local and remote sources.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-slate-200/60 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <Database size={16} />
              <span>Indexed Files</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {datasets?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/60 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <FileText size={16} />
              <span>Storage Footprint</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {formatBytes(datasets?.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0) || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/60 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <Activity size={16} />
              <span>Aggregated Rows</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              0
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/60 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <Zap size={16} />
              <span>Ingestion SLA</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              99.99%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Workspace Section */}
      {selectedDataset ? (
        <DatasetDetail dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />
      ) : (
        <div className="flex flex-col bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
          
          {/* Toolbar */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-4 border-b border-slate-100 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase shrink-0">
                Data Workspace
              </h2>
              <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1" />
              {/* Breadcrumbs */}
              <div className="flex items-center overflow-x-auto hide-scrollbar whitespace-nowrap text-sm">
                {currentPath.map((pathNode, idx) => (
                  <React.Fragment key={pathNode.id || 'root'}>
                    {idx > 0 && <ChevronRight size={14} className="text-slate-400 mx-1 shrink-0" />}
                    <button 
                      onClick={() => handleNavigateUp(idx)}
                      className={`hover:text-indigo-600 transition-colors shrink-0 ${idx === currentPath.length - 1 ? 'font-semibold text-slate-900' : 'text-slate-500'}`}
                    >
                      {pathNode.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search datasets, folders..." 
                className="h-8 pl-8 text-xs bg-slate-50/50 border-slate-200 focus-visible:ring-indigo-500/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
            <span className="text-sm font-medium text-slate-500 mr-2 whitespace-nowrap hidden sm:inline-block">Repository</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger render={filterTrigger}>
                <Filter size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setFilterType('all')} className="flex items-center justify-between">
                  <span>All Types</span>
                  {filterType === 'all' && <Check size={14} className="text-indigo-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('folders')} className="flex items-center justify-between">
                  <span>Folders Only</span>
                  {filterType === 'folders' && <Check size={14} className="text-indigo-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('datasets')} className="flex items-center justify-between">
                  <span>Files Only</span>
                  {filterType === 'datasets' && <Check size={14} className="text-indigo-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('connections')} className="flex items-center justify-between">
                  <span>Connections Only</span>
                  {filterType === 'connections' && <Check size={14} className="text-indigo-600" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 text-slate-600 border-slate-200" onClick={handleRefresh}>
              <RefreshCw size={14} />
            </Button>
            
            <div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />

            {/* New Folder Dialog */}
            <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
              <DialogTrigger render={newFolderTrigger}>
                <FolderPlus size={14} className="mr-2" />
                New Folder
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                  <DialogDescription>
                    Create a new folder inside "{currentPath[currentPath.length - 1].name}".
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g. Sales Data"
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button disabled={createFolderMutation.isPending || !newFolderName.trim()} onClick={handleCreateFolder}>
                    {createFolderMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Folder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
            />
            <Button 
              size="sm" 
              disabled={createDatasetMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
              className="h-8 text-xs shrink-0 font-medium bg-[#0f172a] hover:bg-slate-800 text-white border-transparent"
            >
              {createDatasetMutation.isPending ? (
                <Loader2 size={14} className="mr-2 animate-spin" />
              ) : (
                <CloudUpload size={14} className="mr-2" />
              )}
              Upload
            </Button>

            <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
              <DialogTrigger render={connectTrigger}>
                <Globe size={14} className="mr-2" />
                Connect
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Connect Data Source</DialogTitle>
                  <DialogDescription>
                    Create a new connection to a remote database or API.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="conn-name" className="text-right">Name</Label>
                    <Input
                      id="conn-name"
                      value={connectionName}
                      onChange={(e) => setConnectionName(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g. Production DB"
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateConnection()}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="conn-type" className="text-right">Type</Label>
                    <select
                      id="conn-type"
                      value={connectionType}
                      onChange={(e) => setConnectionType(e.target.value)}
                      className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="postgres">PostgreSQL</option>
                      <option value="mysql">MySQL</option>
                      <option value="snowflake">Snowflake</option>
                      <option value="aws">AWS Services</option>
                      <option value="cloud">Cloud Storage</option>
                      <option value="api">REST API</option>
                    </select>
                  </div>
                  {connectionType === 'api' ? (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="conn-url" className="text-right">API URL</Label>
                        <Input
                          id="conn-url"
                          value={connectionUrl}
                          onChange={(e) => setConnectionUrl(e.target.value)}
                          className="col-span-3"
                          placeholder="https://api.example.com/v1"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="conn-key" className="text-right">API Key</Label>
                        <Input
                          id="conn-key"
                          type="password"
                          value={connectionKey}
                          onChange={(e) => setConnectionKey(e.target.value)}
                          className="col-span-3"
                          placeholder="sk-..."
                          onKeyDown={(e) => e.key === 'Enter' && handleCreateConnection()}
                        />
                      </div>
                    </>
                  ) : connectionType === 'aws' || connectionType === 'cloud' ? (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="conn-url" className="text-right">Bucket URL</Label>
                        <Input
                          id="conn-url"
                          value={connectionUrl}
                          onChange={(e) => setConnectionUrl(e.target.value)}
                          className="col-span-3"
                          placeholder="s3://my-bucket/"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="conn-key" className="text-right">Access Key</Label>
                        <Input
                          id="conn-key"
                          type="password"
                          value={connectionKey}
                          onChange={(e) => setConnectionKey(e.target.value)}
                          className="col-span-3"
                          placeholder="AKI..."
                          onKeyDown={(e) => e.key === 'Enter' && handleCreateConnection()}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="conn-url" className="text-right">Conn. String</Label>
                      <Input
                        id="conn-url"
                        type="password"
                        value={connectionUrl}
                        onChange={(e) => setConnectionUrl(e.target.value)}
                        className="col-span-3"
                        placeholder="postgresql://user:pass@host/db"
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateConnection()}
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button disabled={createConnectionMutation.isPending || !connectionName.trim()} onClick={handleCreateConnection}>
                    {createConnectionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Connect
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
            <p className="text-sm">Loading repository...</p>
          </div>
        ) : isTrulyEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
            <div className="w-24 h-24 rounded-full bg-cyan-100/50 flex items-center justify-center mb-6">
              <Database size={40} className="text-cyan-500 stroke-[1.5]" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">No datasets found</h3>
            <p className="text-sm text-slate-500 max-w-md mb-8">
              Upload files or connect a remote source to start building your repository.
            </p>

            <div className="flex items-center gap-4">
              <Button onClick={() => fileInputRef.current?.click()} className="h-10 px-6 text-sm font-medium bg-[#0f172a] hover:bg-slate-800 text-white border-transparent">
                Upload Files
              </Button>
              <Button variant="outline" className="h-10 px-6 text-sm font-medium border-slate-200 text-slate-700">
                Connect Source
              </Button>
            </div>
          </div>
        ) : isSearchEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
              <Search size={32} className="text-slate-400 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No results found</h3>
            <p className="text-sm text-slate-500 max-w-md">
              We couldn't find anything matching your search "{searchQuery}" with the current filters.
            </p>
            <Button variant="outline" className="mt-6 h-9" onClick={() => { setSearchQuery(''); setFilterType('all'); }}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto bg-slate-50/30">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-100/50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">Name</th>
                  <th scope="col" className="px-6 py-3 font-semibold hidden md:table-cell">Type</th>
                  <th scope="col" className="px-6 py-3 font-semibold hidden lg:table-cell">Size</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Last Modified</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Folders */}
                {filteredFolders?.map((folder) => (
                  <tr 
                    key={folder.id} 
                    className="bg-white border-b border-slate-100 hover:bg-slate-50/80 transition-colors group"
                  >
                    <td 
                      className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3 cursor-pointer"
                      onClick={() => handleNavigateToFolder(folder.id, folder.name)}
                    >
                      <Folder size={18} className="text-indigo-500 fill-indigo-100 group-hover:text-indigo-600" />
                      {folder.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 hidden md:table-cell">Folder</td>
                    <td className="px-6 py-4 text-slate-500 hidden lg:table-cell">-</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(folder.updatedAt || folder.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right dropdown-trigger">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={rowMenuTrigger}>
                          <MoreVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openRenameModal('folder', folder.id, folder.name)}>
                            <Pencil size={14} className="mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => setDeleteItem({ type: 'folder', id: folder.id, name: folder.name })}>
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                
                {/* Datasets */}
                {filteredDatasets?.map((dataset) => (
                  <tr 
                    key={dataset.id} 
                    className="bg-white border-b border-slate-100 hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={(e) => {
                      // Prevent row click if clicking dropdown
                      if ((e.target as HTMLElement).closest('.dropdown-trigger')) return;
                      setSelectedDataset(dataset);
                    }}
                  >
                    <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-3">
                      <FileText size={18} className="text-slate-400" />
                      {dataset.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 hidden md:table-cell uppercase">
                      {dataset.format || 'FILE'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 hidden lg:table-cell">
                      {dataset.sizeBytes ? formatBytes(dataset.sizeBytes) : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(dataset.updatedAt || dataset.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right dropdown-trigger">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={rowMenuTrigger}>
                          <MoreVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openRenameModal('dataset', dataset.id, dataset.name)}>
                            <Pencil size={14} className="mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => setDeleteItem({ type: 'dataset', id: dataset.id, name: dataset.name })}>
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                
                {/* Connections */}
                {filteredConnections?.map((connection) => (
                  <tr 
                    key={connection.id} 
                    className="bg-white border-b border-slate-100 hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-3">
                      <Globe size={18} className="text-emerald-500" />
                      {connection.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 hidden md:table-cell uppercase">
                      {connection.type}
                    </td>
                    <td className="px-6 py-4 text-slate-500 hidden lg:table-cell">
                      -
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(connection.updatedAt || connection.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right dropdown-trigger">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={rowMenuTrigger}>
                          <MoreVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem variant="destructive" onClick={() => toast.info('Delete connection not implemented')}>
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* Rename Dialog */}
      <Dialog open={!!renameItem} onOpenChange={(open) => !open && setRenameItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename {renameItem?.type === 'folder' ? 'Folder' : 'File'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rename-input" className="text-right">Name</Label>
              <Input
                id="rename-input"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                className="col-span-3"
                onKeyDown={(e) => e.key === 'Enter' && handleRenameItem()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameItem(null)}>Cancel</Button>
            <Button onClick={handleRenameItem} disabled={updateFolderMutation.isPending || updateDatasetMutation.isPending || !renameInput.trim()}>
              {(updateFolderMutation.isPending || updateDatasetMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete {deleteItem?.type === 'folder' ? 'Folder' : 'File'}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteItem?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteItem} disabled={deleteFolderMutation.isPending || deleteDatasetMutation.isPending}>
              {(deleteFolderMutation.isPending || deleteDatasetMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
