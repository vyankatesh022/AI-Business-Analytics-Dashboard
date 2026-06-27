import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkspaceDataset } from '../../types';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Table as TableIcon, 
  Settings2, 
  LineChart, 
  Network, 
  Activity,
  Download,
  Share2,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface DatasetExplorerProps {
  dataset: WorkspaceDataset;
}

const menuTriggerBtn = <button className={cn(buttonVariants({ variant: "ghost", size: "icon" }))} />;

export function DatasetExplorer({ dataset }: DatasetExplorerProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight">{dataset.name}</h1>
            <Badge variant={dataset.status === 'ACTIVE' ? 'default' : 'secondary'} className="rounded-full">
              {dataset.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{dataset.rowCount ? dataset.rowCount.toLocaleString() : 0} rows</span>
            <span>•</span>
            <span>{formatBytes(dataset.sizeBytes || 0)}</span>
            <span>•</span>
            <span>Version {dataset.version}</span>
            {dataset.format && (
              <>
                <span>•</span>
                <span className="uppercase">{dataset.format}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={menuTriggerBtn}>
                <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Move</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="table" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 border-b">
          <TabsList className="h-12 w-full justify-start bg-transparent p-0">
            <TabsTrigger value="table" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 font-medium">
              <TableIcon className="w-4 h-4 mr-2" />
              Table
            </TabsTrigger>
            <TabsTrigger value="schema" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 font-medium">
              <Settings2 className="w-4 h-4 mr-2" />
              Schema
            </TabsTrigger>
            <TabsTrigger value="statistics" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 font-medium">
              <LineChart className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="lineage" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 font-medium hidden md:flex">
              <Network className="w-4 h-4 mr-2" />
              Lineage
            </TabsTrigger>
            <TabsTrigger value="activity" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 font-medium hidden lg:flex">
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 h-full">
            <TabsContent value="table" className="h-full m-0 data-[state=inactive]:hidden">
              <div className="flex items-center justify-center h-64 border rounded-xl bg-muted/10 border-dashed">
                <div className="text-center">
                  <TableIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg">Enterprise Data Grid</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mt-1">
                    Virtualized grid rendering will display millions of rows here with server-side pagination.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schema" className="m-0 data-[state=inactive]:hidden">
              <div className="flex items-center justify-center h-64 border rounded-xl bg-muted/10 border-dashed">
                <div className="text-center">
                  <Settings2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg">Schema Explorer</h3>
                  <p className="text-muted-foreground text-sm">Column definitions, types, and constraints.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="m-0 data-[state=inactive]:hidden">
              <div className="flex items-center justify-center h-64 border rounded-xl bg-muted/10 border-dashed">
                <div className="text-center">
                  <LineChart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg">Data Distribution</h3>
                  <p className="text-muted-foreground text-sm">Automated statistics calculation.</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
