'use client';

import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { WorkspaceNode } from '../../types';
import { WorkspaceTree } from '../explorer/WorkspaceTree';
import { EmptyState } from '../explorer/EmptyState';
import { DatasetExplorer } from '../dataset/DatasetExplorer';
import { ConnectionExplorer } from '../connection/ConnectionExplorer';
import { DetailsPanel } from '../details/DetailsPanel';
import { motion, AnimatePresence } from 'framer-motion';

export function WorkspaceLayout() {
  const [activeNode, setActiveNode] = useState<WorkspaceNode | null>(null);
  
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-background">
      <ResizablePanelGroup orientation="horizontal" className="h-full w-full border-t">
        {/* Left Panel: Tree Explorer */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="flex flex-col bg-muted/20">
          <WorkspaceTree activeNode={activeNode} onSelectNode={setActiveNode} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Center Panel: Content Explorer */}
        <ResizablePanel defaultSize={60} minSize={40} className="flex flex-col relative bg-background shadow-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode ? activeNode.data.id : 'empty'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 overflow-y-auto"
            >
              {!activeNode && <EmptyState />}
              {activeNode?.type === 'dataset' && <DatasetExplorer dataset={activeNode.data} />}
              {activeNode?.type === 'connection' && <ConnectionExplorer connection={activeNode.data} />}
              {activeNode?.type === 'folder' && <EmptyState folder={activeNode.data} />}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>

        <ResizableHandle withHandle />
        
        {/* Right Panel: Details & Governance */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="flex flex-col bg-muted/10">
          <DetailsPanel activeNode={activeNode} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
