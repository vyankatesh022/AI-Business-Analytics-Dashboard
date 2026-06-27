"use client";

import React, { useRef, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  useReactFlow
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';

const initialNodes = [
  { id: '1', type: 'input', position: { x: 250, y: 5 }, data: { label: 'Trigger: High Churn Risk' } },
  { id: '2', position: { x: 250, y: 100 }, data: { label: 'Condition: ARR > $50k' } },
  { id: '3', position: { x: 250, y: 200 }, data: { label: 'Action: Notify CSM via Slack' }, type: 'output' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

let id = 4;
const getId = () => `${id++}`;

function WorkflowBuilderFlow() {
  const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label: nodeLabel }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const typeData = event.dataTransfer.getData('application/reactflow');
      if (!typeData) return;

      const { type, label } = JSON.parse(typeData);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${label}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const handleSave = () => {
    alert('Workflow saved successfully!');
    router.push('/workflows');
  };

  return (
    <div className="h-[calc(100vh-8rem)] w-full flex flex-col md:flex-row gap-4 p-4">
      {/* Sidebar / Node Palette */}
      <Card className="w-full md:w-64 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-semibold text-lg">Nodes</h3>
          <Button size="sm" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
        <div className="text-sm font-medium text-muted-foreground">Triggers</div>
        <div 
          className="p-3 border rounded bg-background cursor-grab hover:border-primary transition-colors shadow-sm"
          draggable 
          onDragStart={(e) => onDragStart(e, 'input', 'Analytics Alert')}
        >
          Analytics Alert
        </div>
        <div 
          className="p-3 border rounded bg-background cursor-grab hover:border-primary transition-colors shadow-sm"
          draggable 
          onDragStart={(e) => onDragStart(e, 'input', 'Prediction Risk')}
        >
          Prediction Risk
        </div>
        
        <div className="text-sm font-medium text-muted-foreground mt-4">Conditions</div>
        <div 
          className="p-3 border rounded bg-background cursor-grab hover:border-primary transition-colors shadow-sm"
          draggable 
          onDragStart={(e) => onDragStart(e, 'default', 'If / Else Branch')}
        >
          If / Else Branch
        </div>
        
        <div className="text-sm font-medium text-muted-foreground mt-4">Actions</div>
        <div 
          className="p-3 border rounded bg-background cursor-grab hover:border-primary transition-colors shadow-sm"
          draggable 
          onDragStart={(e) => onDragStart(e, 'output', 'Send Email')}
        >
          Send Email
        </div>
        <div 
          className="p-3 border rounded bg-background cursor-grab hover:border-primary transition-colors shadow-sm"
          draggable 
          onDragStart={(e) => onDragStart(e, 'output', 'Internal Notification')}
        >
          Internal Notification
        </div>
      </Card>

      {/* Canvas */}
      <Card className="flex-1 relative rounded-xl overflow-hidden border bg-slate-50" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </Card>
    </div>
  );
}

export function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderFlow />
    </ReactFlowProvider>
  );
}
