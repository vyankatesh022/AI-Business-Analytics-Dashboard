import React from 'react';
import { WorkspaceConnection } from '../../types';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Database,
  Play,
  RefreshCw,
  MoreVertical,
  Activity,
  Settings,
  History
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ConnectionExplorerProps {
  connection: WorkspaceConnection;
}

const menuTriggerBtn = <button className={cn(buttonVariants({ variant: "ghost", size: "icon" }))} />;

export function ConnectionExplorer({ connection }: ConnectionExplorerProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight">{connection.name}</h1>
            <Badge variant="outline" className="rounded-full text-green-600 bg-green-50 border-green-200">
              Connected
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="uppercase font-medium">{connection.type}</span>
            {connection.host && (
              <>
                <span>•</span>
                <span>{connection.host}{connection.port ? `:${connection.port}` : ''}</span>
              </>
            )}
            {connection.databaseName && (
              <>
                <span>•</span>
                <span>DB: {connection.databaseName}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Play className="w-4 h-4 mr-2 text-green-600" />
            Test Connection
          </Button>
          <Button variant="default" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Now
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={menuTriggerBtn}>
                <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
              <DropdownMenuItem>Schedule Sync</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 border-b">
          <TabsList className="h-12 w-full justify-start bg-transparent p-0">
            <TabsTrigger value="overview" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 font-medium">
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="settings" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 font-medium">
              <Settings className="w-4 h-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="history" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 font-medium">
              <History className="w-4 h-4 mr-2" />
              Sync History
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 h-full">
            <TabsContent value="overview" className="h-full m-0 data-[state=inactive]:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-xl p-6 bg-card shadow-sm">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2 text-primary" />
                    Connection Health
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium text-green-600">Healthy</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-muted-foreground">Last Sync</span>
                      <span className="font-medium">2 mins ago</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-muted-foreground">Latency</span>
                      <span className="font-medium">45ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Synced Datasets</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="m-0 data-[state=inactive]:hidden">
              <div className="flex items-center justify-center h-64 border rounded-xl bg-muted/10 border-dashed">
                <div className="text-center">
                  <Settings className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg">Secure Configuration</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mt-1">
                    Edit credentials securely. Passwords and keys are never exposed.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="m-0 data-[state=inactive]:hidden">
              <div className="flex items-center justify-center h-64 border rounded-xl bg-muted/10 border-dashed">
                <div className="text-center">
                  <History className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg">Sync Logs</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mt-1">
                    Audit logs and synchronization history will appear here.
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
