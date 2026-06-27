import React from 'react';
import { Database, FileSpreadsheet, FolderPlus, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkspaceFolder } from '../../types';

interface EmptyStateProps {
  folder?: WorkspaceFolder;
}

export function EmptyState({ folder }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-b from-background to-muted/20">
      <div className="w-64 h-64 mb-8 relative">
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl" />
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xl text-primary"
        >
          <path
            fill="currentColor"
            d="M45.7,-76.3C58.9,-69.3,69,-55.4,78.2,-41.2C87.4,-27,95.7,-12.4,94.3,1.4C93,15.2,82,28.2,71.2,39.6C60.4,51,49.8,60.8,36.8,68.8C23.8,76.8,8.4,83,-6.9,82.3C-22.2,81.6,-37.4,74,-51,64.2C-64.6,54.4,-76.6,42.4,-83.4,27.5C-90.2,12.6,-91.8,-5.2,-86.6,-20.9C-81.4,-36.6,-69.4,-50.2,-55.1,-58.5C-40.8,-66.8,-24.2,-69.8,-8.1,-69.4C8,-69,26,-65.2,45.7,-76.3Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      
      <h2 className="text-3xl font-bold tracking-tight mb-3">
        {folder ? `Folder: ${folder.name}` : 'Enterprise Data Workspace'}
      </h2>
      <p className="text-muted-foreground max-w-lg mb-8">
        {folder 
          ? 'This folder is empty. Get started by adding a dataset or connection.'
          : 'Welcome to your unified workspace. Manage all your datasets, connections, and data assets in one secure place.'}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full">
        <QuickActionCard 
          icon={<FolderPlus className="w-6 h-6" />}
          title="New Folder"
          description="Organize your assets"
        />
        <QuickActionCard 
          icon={<FileSpreadsheet className="w-6 h-6" />}
          title="Upload Dataset"
          description="CSV, XLSX, Parquet"
        />
        <QuickActionCard 
          icon={<Database className="w-6 h-6" />}
          title="New Connection"
          description="Connect to database"
        />
        <QuickActionCard 
          icon={<Network className="w-6 h-6" />}
          title="Add API"
          description="Connect REST/GraphQL"
        />
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Button 
      variant="outline" 
      className="h-auto flex flex-col items-center justify-center p-6 gap-3 border-dashed hover:border-solid hover:bg-primary/5 transition-all group rounded-xl"
    >
      <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-center">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      </div>
    </Button>
  );
}
