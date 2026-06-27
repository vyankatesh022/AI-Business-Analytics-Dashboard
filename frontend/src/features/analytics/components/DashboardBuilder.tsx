import React, { useState, useEffect } from 'react';
import { useDashboard, useUpdateDashboard } from '../api';
import { DashboardCard, Dashboard } from '../types';
import { KPICard } from '@/components/analytics/kpi-card';
import { TrendChart, CohortHeatmap, AnalyticsFunnelChart } from '@/components/analytics/chart-system';
import { FilterEngine } from '@/components/analytics/filter-engine';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LayoutGrid, Plus, Save, Activity, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// ---- Modals & Wrappers ----

function WidgetEditModal({ 
  card, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  card: DashboardCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: DashboardCard) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    if (card) {
      setTitle(card.title || '');
      setDescription(card.config?.description || '');
      setChartType(card.config?.chart_type || 'line');
    }
  }, [card]);

  if (!card) return null;

  const handleSave = () => {
    const updatedCard: DashboardCard = {
      ...card,
      title,
      config: {
        ...card.config,
        description,
        ...(card.type === 'chart' ? { chart_type: chartType } : {})
      }
    };
    onSave(updatedCard);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Widget</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {card.type === 'chart' && (
            <div className="grid gap-2">
              <Label htmlFor="type">Chart Type</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WidgetWrapper({ 
  card, 
  children,
  onEdit
}: { 
  card: DashboardCard;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="relative group h-full">
      {children}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur shadow-sm hover:bg-white border">
              <MoreVertical className="h-4 w-4 text-zinc-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ---- Main Builder Component ----

interface DashboardBuilderProps {
  dashboardId: string;
}

export function DashboardBuilder({ dashboardId }: DashboardBuilderProps) {
  const { data: dashboard, isLoading, error } = useDashboard(dashboardId);
  const updateDashboard = useUpdateDashboard();
  
  const [filters, setFilters] = useState({});
  const [localCards, setLocalCards] = useState<DashboardCard[]>([]);
  
  const [editingCard, setEditingCard] = useState<DashboardCard | null>(null);

  // Sync with backend on load
  useEffect(() => {
    if (dashboard?.cards) {
      setLocalCards(dashboard.cards);
    }
  }, [dashboard?.cards]);

  const handleSaveView = async () => {
    if (!dashboard) return;
    await updateDashboard.mutateAsync({
      id: dashboard.id,
      cards: localCards,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center">
        <div className="animate-spin text-zinc-500">
          <Activity className="w-8 h-8" />
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="w-full p-12 flex flex-col items-center justify-center bg-card rounded-2xl border border-border shadow-sm">
        <LayoutGrid className="w-12 h-12 text-zinc-400 mb-4" />
        <h2 className="text-xl font-medium text-zinc-900 mb-2">Dashboard not found</h2>
        <p className="text-muted-foreground text-center">We couldn't load the requested dashboard.</p>
      </div>
    );
  }

  const renderCard = (card: DashboardCard) => {
    switch (card.type) {
      case 'kpi':
        return <KPICard title={card.title} value={card.config.value || 0} trend={card.config.trend || 0} />;
      case 'chart':
        if (card.config.chart_type === 'area') {
          const mockData = [
            { name: 'Jan', revenue: 4000, users: 2400 },
            { name: 'Feb', revenue: 3000, users: 1398 },
            { name: 'Mar', revenue: 2000, users: 9800 },
            { name: 'Apr', revenue: 2780, users: 3908 },
            { name: 'May', revenue: 1890, users: 4800 },
            { name: 'Jun', revenue: 2390, users: 3800 },
            { name: 'Jul', revenue: 3490, users: 4300 },
          ];
          return (
            <TrendChart 
              title={card.title} 
              description={card.config.description}
              data={mockData} 
              xKey="name"
              series={[
                { key: 'revenue', name: 'Revenue', color: '#818cf8' },
                { key: 'users', name: 'Active Users', color: '#34d399' }
              ]} 
              type="area"
            />
          );
        }
        if (card.config.chart_type === 'bar') {
          const mockData = [
            { name: 'Enterprise', mrr: 15000 },
            { name: 'Pro', mrr: 8000 },
            { name: 'Starter', mrr: 2500 },
          ];
          return (
            <TrendChart 
              title={card.title} 
              description={card.config.description}
              data={mockData} 
              xKey="name"
              series={[
                { key: 'mrr', name: 'MRR', color: '#f472b6' }
              ]} 
              type="bar"
            />
          );
        }
        // Default to line chart
        const mockLineData = [
          { name: 'Jan', mrr: 4000 },
          { name: 'Feb', mrr: 3000 },
          { name: 'Mar', mrr: 5000 },
          { name: 'Apr', mrr: 2780 },
          { name: 'May', mrr: 1890 },
        ];
        return (
          <TrendChart 
            title={card.title} 
            description={card.config.description}
            data={mockLineData} 
            xKey="name"
            series={[{ key: 'mrr', name: 'Value', color: '#8b5cf6' }]} 
            type="line"
          />
        );
      case 'cohort':
        return <CohortHeatmap title={card.title} description={card.config.description} data={[]} />;
      case 'funnel':
        return <AnalyticsFunnelChart title={card.title} description={card.config.description} data={[]} />;
      default:
        return <div className="p-6 bg-card rounded-2xl border border-border shadow-sm h-full flex items-center justify-center text-muted-foreground">Unknown widget type</div>;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <WidgetEditModal 
        card={editingCard} 
        isOpen={!!editingCard} 
        onClose={() => setEditingCard(null)} 
        onSave={(updatedCard) => {
          setLocalCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
        }}
      />
      
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">{dashboard.name}</h1>
          {dashboard.description && (
            <p className="text-sm text-muted-foreground mt-1">{dashboard.description}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSaveView}
            className="px-4 py-2 bg-white border hover:bg-zinc-50 text-zinc-700 shadow-sm text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {updateDashboard.isPending ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save View
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Widget
          </button>
        </div>
      </div>

      {/* Filter Engine */}
      <div className="flex gap-2 pb-2">
        <FilterEngine onFilterChange={setFilters} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {localCards.map(card => {
          // Parse position to generate tailwind classes for column spanning
          const colSpan = card.position.w >= 4 ? 'col-span-full' : 
                         card.position.w >= 3 ? 'lg:col-span-3' : 
                         card.position.w >= 2 ? 'md:col-span-2' : 'col-span-1';
          
          return (
            <div key={card.id} className={colSpan}>
              <WidgetWrapper card={card} onEdit={() => setEditingCard(card)}>
                {renderCard(card)}
              </WidgetWrapper>
            </div>
          );
        })}
        {(!localCards || localCards.length === 0) && (
           <div className="col-span-full p-12 flex flex-col items-center justify-center bg-card rounded-2xl border border-border border-dashed shadow-sm">
             <LayoutGrid className="w-10 h-10 text-zinc-400 mb-4" />
             <h3 className="text-lg font-medium text-zinc-900 mb-1">Empty Dashboard</h3>
             <p className="text-muted-foreground text-sm mb-4">Add your first widget to get started.</p>
             <button className="px-4 py-2 bg-white border hover:bg-zinc-50 text-zinc-700 shadow-sm text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
               <Plus className="w-4 h-4" />
               Add Widget
             </button>
           </div>
        )}
      </div>
    </div>
  );
}
