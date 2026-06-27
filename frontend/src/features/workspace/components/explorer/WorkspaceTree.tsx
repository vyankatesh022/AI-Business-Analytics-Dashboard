import React, { useEffect, useState } from 'react';
import { WorkspaceNode, WorkspaceFolder, WorkspaceDataset, WorkspaceConnection } from '../../types';
import { workspaceApi } from '../../api/workspaceApi';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  Table2, 
  Database,
  Plus,
  Search,
  MoreVertical
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface WorkspaceTreeProps {
  activeNode: WorkspaceNode | null;
  onSelectNode: (node: WorkspaceNode) => void;
}

const menuTriggerBtn = <button className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-6 w-6")} />;

export function WorkspaceTree({ activeNode, onSelectNode }: WorkspaceTreeProps) {
  const [rootNodes, setRootNodes] = useState<WorkspaceNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial root nodes
    const loadRoot = async () => {
      try {
        setLoading(true);
        const folders = await workspaceApi.getFolders(null);
        const datasets = await workspaceApi.getDatasets(null);
        const connections = await workspaceApi.getConnections(null);

        const nodes: WorkspaceNode[] = [
          ...folders.map(f => ({ type: 'folder' as const, data: f, children: [] })),
          ...datasets.map(d => ({ type: 'dataset' as const, data: d })),
          ...connections.map(c => ({ type: 'connection' as const, data: c }))
        ];

        setRootNodes(nodes);
      } catch (err) {
        console.error("Failed to load workspace root", err);
      } finally {
        setLoading(false);
      }
    };
    loadRoot();
  }, []);

  return (
    <div className="flex flex-col h-full bg-muted/10">
      <div className="p-3 border-b bg-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold tracking-tight text-sm uppercase text-muted-foreground">Workspace</h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger render={menuTriggerBtn}>
                  <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>New Folder</DropdownMenuItem>
                <DropdownMenuItem>Upload Dataset</DropdownMenuItem>
                <DropdownMenuItem>New Connection</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search assets..." 
            className="pl-8 h-8 text-xs bg-background"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Loading workspace...</div>
        ) : rootNodes.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Workspace is empty</div>
        ) : (
          <div className="space-y-[2px]">
            {rootNodes.map(node => (
              <TreeNode 
                key={`${node.type}-${node.data.id}`} 
                node={node} 
                level={0} 
                activeNode={activeNode}
                onSelectNode={onSelectNode}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

interface TreeNodeProps {
  node: WorkspaceNode;
  level: number;
  activeNode: WorkspaceNode | null;
  onSelectNode: (node: WorkspaceNode) => void;
}

function TreeNode({ node, level, activeNode, onSelectNode }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<WorkspaceNode[]>(node.type === 'folder' ? node.children : []);
  const [loading, setLoading] = useState(false);

  const isActive = activeNode?.data.id === node.data.id && activeNode?.type === node.type;

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type !== 'folder') return;
    
    if (!expanded && children.length === 0) {
      setLoading(true);
      try {
        const folders = await workspaceApi.getFolders(node.data.id);
        const datasets = await workspaceApi.getDatasets(node.data.id);
        const connections = await workspaceApi.getConnections(node.data.id);

        const loadedChildren: WorkspaceNode[] = [
          ...folders.map(f => ({ type: 'folder' as const, data: f, children: [] })),
          ...datasets.map(d => ({ type: 'dataset' as const, data: d })),
          ...connections.map(c => ({ type: 'connection' as const, data: c }))
        ];
        
        setChildren(loadedChildren);
      } catch (err) {
        console.error("Failed to load children", err);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  const getIcon = () => {
    if (node.type === 'folder') {
      return expanded ? <FolderOpen className="w-4 h-4 text-blue-500 mr-2" /> : <Folder className="w-4 h-4 text-blue-500 mr-2 fill-blue-500/20" />;
    }
    if (node.type === 'dataset') {
      return <Table2 className="w-4 h-4 text-emerald-500 mr-2" />;
    }
    if (node.type === 'connection') {
      return <Database className="w-4 h-4 text-purple-500 mr-2" />;
    }
    return null;
  };

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer text-sm transition-colors group
          ${isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-foreground/80'}
        `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onSelectNode(node)}
      >
        <div 
          className="w-4 h-4 mr-1 flex items-center justify-center cursor-pointer opacity-50 hover:opacity-100"
          onClick={handleToggle}
        >
          {node.type === 'folder' ? (
            expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <div className="w-3.5 h-3.5" />
          )}
        </div>
        
        {getIcon()}
        
        <span className="truncate flex-1">{node.data.name}</span>
        
        {loading && <span className="text-[10px] text-muted-foreground ml-2 animate-pulse">...</span>}
      </div>
      
      {expanded && node.type === 'folder' && (
        <div className="mt-[2px] space-y-[2px]">
          {children.length === 0 && !loading ? (
            <div 
              className="text-xs text-muted-foreground py-1 italic"
              style={{ paddingLeft: `${(level + 1) * 12 + 32}px` }}
            >
              Empty folder
            </div>
          ) : (
            children.map(child => (
              <TreeNode 
                key={`${child.type}-${child.data.id}`} 
                node={child} 
                level={level + 1} 
                activeNode={activeNode}
                onSelectNode={onSelectNode}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
