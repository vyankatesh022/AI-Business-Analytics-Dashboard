import React from 'react';
import { WorkspaceNode } from '../../types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatBytes } from '@/lib/utils';
import { Info, Tag, Clock, ShieldCheck, User } from 'lucide-react';

interface DetailsPanelProps {
  activeNode: WorkspaceNode | null;
}

export function DetailsPanel({ activeNode }: DetailsPanelProps) {
  if (!activeNode) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
        <Info className="w-12 h-12 mb-4 opacity-20" />
        <p>Select an item in the workspace to view its properties and metadata.</p>
      </div>
    );
  }

  const { data, type } = activeNode;

  return (
    <div className="flex flex-col h-full bg-muted/10">
      <div className="px-4 py-4 border-b bg-card">
        <h3 className="font-semibold tracking-tight">Properties</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* General Info */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center">
              <Info className="w-3 h-3 mr-2" />
              General
            </h4>
            <div className="space-y-3 text-sm">
              <DetailRow label="Name" value={data.name} />
              <DetailRow label="Type" value={<span className="capitalize">{type}</span>} />
              {type === 'dataset' && (
                <>
                  <DetailRow label="Format" value={data.format ? <span className="uppercase">{data.format}</span> : 'Unknown'} />
                  <DetailRow label="Size" value={data.sizeBytes ? formatBytes(data.sizeBytes) : 'Unknown'} />
                  <DetailRow label="Rows" value={data.rowCount?.toLocaleString() || 'Unknown'} />
                </>
              )}
              {type === 'connection' && (
                <>
                  <DetailRow label="Engine" value={<span className="uppercase">{data.type}</span>} />
                  <DetailRow label="Host" value={data.host || 'N/A'} />
                  <DetailRow label="Database" value={data.databaseName || 'N/A'} />
                </>
              )}
              {type === 'folder' && (
                <DetailRow label="Color Label" value={
                  data.colorLabel ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.colorLabel }} />
                      {data.colorLabel}
                    </div>
                  ) : 'None'
                } />
              )}
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center">
              <Clock className="w-3 h-3 mr-2" />
              Metadata
            </h4>
            <div className="space-y-3 text-sm">
              <DetailRow label="Created" value={new Date(data.createdAt).toLocaleDateString()} />
              <DetailRow label="Updated" value={new Date(data.updatedAt).toLocaleDateString()} />
              {type === 'dataset' && <DetailRow label="Version" value={`v${data.version}`} />}
            </div>
          </div>

          <Separator />

          {/* Governance */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center">
              <ShieldCheck className="w-3 h-3 mr-2" />
              Governance
            </h4>
            <div className="space-y-3 text-sm">
              <DetailRow label="Owner" value={
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  Workspace Admin
                </div>
              } />
              <DetailRow label="Classification" value={<Badge variant="secondary" className="text-[10px]">Internal</Badge>} />
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center">
              <Tag className="w-3 h-3 mr-2" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {'tags' in data && (data as any).tags && (data as any).tags.length > 0 ? (
                (data as any).tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="bg-background">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No tags assigned</span>
              )}
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}

function DetailRow({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-medium break-all">{value}</span>
    </div>
  );
}
