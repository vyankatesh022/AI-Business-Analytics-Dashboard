import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Dataset, FolderNode } from "@/services/datasetApi";
import CreateFolderModal from "./CreateFolderModal";
import RenameFolderModal from "./RenameFolderModal";
import RenameDatasetModal from "./RenameDatasetModal";
import { 
  Search, Filter, Plus, UploadCloud, Globe, RefreshCw, 
  Folder, FileText, MoreVertical, ChevronRight, CornerRightDown, Database,
  GripVertical
} from "lucide-react";
import { filesize } from "filesize";
import { formatDistanceToNow } from "date-fns";
import { DndContext, useDraggable, useDroppable, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useAuthStore } from "@/store/useAuthStore";

interface DataRepositoryProps {
  datasets: Dataset[];
  folders: FolderNode[];
  isLoading: boolean;
  onRefresh: () => void;
  onUploadClick: () => void;
  onConnectClick: () => void;
  onDeleteDataset: (id: string) => void;
  onSelectDataset: (dataset: Dataset) => void;
  onCreateFolder: (name: string, parentId?: string | null) => void;
  onRenameFolder?: (id: string, name: string) => void;
  onDeleteFolder?: (id: string) => void;
  onRenameDataset?: (id: string, name: string) => void;
  onMoveItem?: (itemId: string, type: 'dataset' | 'folder', targetFolderId: string | null) => void;
  currentFolderId: string | null;
  onFolderChange: (id: string | null) => void;
}

interface FolderRowProps {
  folder: FolderNode;
  onClick: (id: string | null) => void;
  onRename?: (folder: FolderNode) => void;
  onDelete?: (id: string) => void;
}

function FolderRow({ folder, onClick, onRename, onDelete }: FolderRowProps) {
  const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = useDraggable({
    id: `folder-${folder.id}`,
    data: { type: 'folder', id: folder.id }
  });
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `folder-drop-${folder.id}`,
    data: { type: 'folder-drop', id: folder.id }
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const style = {
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isOver ? 'var(--card-color-hover, rgba(6, 182, 212, 0.1))' : undefined,
  };

  return (
    <tr 
      ref={(node) => { setDraggableRef(node); setDroppableRef(node); }}
      style={style}
      className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-color)] cursor-pointer transition-colors group ${isOver ? 'ring-2 ring-inset ring-cyan-500' : ''}`}
      onClick={(e) => {
        if (!menuOpen) onClick(folder.id);
      }}
    >
      <td className="px-6 py-4 flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab hover:bg-[var(--border-color)] p-1 rounded -ml-2 text-[var(--text-secondary)]" onClick={e => e.stopPropagation()}>
          <GripVertical className="w-4 h-4" />
        </div>
        <Folder className="w-5 h-5 text-cyan-500 fill-cyan-500/20" />
        <span className="font-semibold text-[var(--text-primary)]">{folder.name}</span>
      </td>
      <td className="px-6 py-4 hidden sm:table-cell text-[var(--text-secondary)] text-sm">Folder</td>
      <td className="px-6 py-4 hidden md:table-cell text-[var(--text-secondary)] text-sm">-</td>
      <td className="px-6 py-4 hidden lg:table-cell text-[var(--text-secondary)] text-sm">-</td>
      <td className="px-6 py-4 hidden xl:table-cell text-[var(--text-secondary)] text-sm">-</td>
      <td className="px-6 py-4 hidden sm:table-cell text-[var(--text-secondary)] text-sm">-</td>
      <td className="px-6 py-4">
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-secondary)]">
          Active
        </span>
      </td>
      <td className="px-6 py-4 text-right relative">
        <div className="flex items-center justify-end gap-2" ref={menuRef}>
          {onRename && onDelete && (
            <button 
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] rounded-md transition-colors"
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          )}
          
          {menuOpen && (
            <div className="absolute right-8 top-8 w-32 bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onRename?.(folder); }}
                className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-color)] transition-colors"
              >
                Rename
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete?.(folder.id); }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

interface DatasetRowProps {
  dataset: Dataset;
  onClick: (dataset: Dataset) => void;
  onRename?: (dataset: Dataset) => void;
  onDelete?: (id: string) => void;
}

function DatasetRow({ dataset, onClick, onRename, onDelete }: DatasetRowProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `dataset-${dataset.id}`,
    data: { type: 'dataset', id: dataset.id }
  });

  const ext = dataset.original_filename?.split('.').pop()?.toUpperCase() || 'CSV';
  const isRemote = dataset.filename.includes('imported');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <tr 
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="border-b border-[var(--border-color)] hover:bg-[var(--bg-color)] transition-colors group cursor-pointer"
      onClick={() => onClick(dataset)}
    >
      <td className="px-6 py-4 flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab hover:bg-[var(--border-color)] p-1 rounded -ml-2 text-[var(--text-secondary)]" onClick={e => e.stopPropagation()}>
          <GripVertical className="w-4 h-4" />
        </div>
        <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
        <div>
          <span className="font-semibold text-[var(--text-primary)] block">{dataset.original_filename || dataset.filename}</span>
          <span className="text-xs text-[var(--text-secondary)] font-mono sm:hidden block mt-0.5">{ext} • {filesize(dataset.size_bytes).toString()}</span>
        </div>
      </td>
      <td className="px-6 py-4 hidden sm:table-cell">
        <span className="px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-secondary)]">
          {ext}
        </span>
      </td>
      <td className="px-6 py-4 hidden md:table-cell text-sm">
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          {isRemote ? <Globe className="w-3.5 h-3.5" /> : <UploadCloud className="w-3.5 h-3.5" />}
          {isRemote ? "Remote Connection" : "Local Upload"}
        </div>
      </td>
      <td className="px-6 py-4 hidden lg:table-cell text-[var(--text-secondary)] text-sm font-mono">
        {filesize(dataset.size_bytes).toString()}
      </td>
      <td className="px-6 py-4 hidden xl:table-cell text-[var(--text-secondary)] text-sm font-mono">
        {dataset.row_count.toLocaleString()}
      </td>
      <td className="px-6 py-4 hidden sm:table-cell text-[var(--text-secondary)] text-sm">
        {formatDistanceToNow(new Date(dataset.updated_at), { addSuffix: true })}
      </td>
      <td className="px-6 py-4">
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span>
          Indexed
        </span>
      </td>
      <td className="px-6 py-4 text-right relative">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
          <button 
            className="px-3 py-1.5 bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold rounded-md hover:bg-[var(--border-color)]"
            onClick={(e) => { e.stopPropagation(); onClick(dataset); }}
          >
            View
          </button>
          {onRename && onDelete && (
            <button 
              className="p-1.5 text-[var(--text-secondary)] hover:bg-[var(--border-color)] rounded-md transition-colors"
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          )}
          {menuOpen && (
            <div className="absolute right-8 top-8 w-32 bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden z-10 text-left">
              <button 
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onRename?.(dataset); }}
                className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-color)] transition-colors"
              >
                Rename
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete?.(dataset.id); }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function DataRepository({ 
  datasets, folders, isLoading, onRefresh, onUploadClick, onConnectClick, onDeleteDataset, onSelectDataset, onCreateFolder, currentFolderId, onFolderChange,
  onRenameFolder, onDeleteFolder, onRenameDataset, onMoveItem
}: DataRepositoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'csv' | 'json' | 'excel'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const [filterMenuPos, setFilterMenuPos] = useState({ top: 0, right: 0 });

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [renameFolderTarget, setRenameFolderTarget] = useState<FolderNode | null>(null);
  const [renameDatasetTarget, setRenameDatasetTarget] = useState<Dataset | null>(null);

  const { hasRole } = useAuthStore();
  const canEdit = hasRole(['Super Admin', 'Data Analyst']);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const activeId = active.data.current?.id;
    const overId = over.data.current?.id; // target folder id

    if (activeId === overId) return; // dropped on itself

    if (activeType && activeId && onMoveItem) {
      if (over.id === 'root-drop') {
         onMoveItem(activeId, activeType as 'dataset' | 'folder', null);
      } else {
         onMoveItem(activeId, activeType as 'dataset' | 'folder', overId as string);
      }
    }
  };

  const handleFilterClick = () => {
    if (!showFilterMenu && filterBtnRef.current) {
      const rect = filterBtnRef.current.getBoundingClientRect();
      setFilterMenuPos({
        top: rect.bottom + 8,
        right: document.documentElement.clientWidth - rect.right,
      });
    }
    setShowFilterMenu(!showFilterMenu);
  };

  useEffect(() => {
    if (!showFilterMenu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowFilterMenu(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (filterBtnRef.current?.contains(e.target as Node)) return;
      const portalContent = document.getElementById("filter-popover-content");
      if (portalContent && !portalContent.contains(e.target as Node)) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterMenu]);
  
  const filteredDatasets = datasets.filter(d => {
    const ext = (d.original_filename?.split('.').pop() || d.filename.split('.').pop() || 'csv').toLowerCase();
    const matchesFolder = (d.folder_id || null) === currentFolderId;
    const matchesSearch = d.filename.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (d.original_filename && d.original_filename.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSource = activeFilter === 'all' || 
                          (activeFilter === 'csv' && ext === 'csv') || 
                          (activeFilter === 'json' && ext === 'json') ||
                          (activeFilter === 'excel' && (ext === 'xlsx' || ext === 'xls'));
    return matchesFolder && matchesSearch && matchesSource;
  });

  const filteredFolders = folders.filter(f => 
    (f.parent_id || null) === currentFolderId &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const buildBreadcrumbs = () => {
    const crumbs = [];
    let curr = currentFolderId;
    while (curr) {
      const f = folders.find(x => x.id === curr);
      if (!f) break;
      crumbs.unshift(f);
      curr = f.parent_id;
    }
    return crumbs;
  };
  const breadcrumbs = buildBreadcrumbs();

  const handleCreateFolderSubmit = (name: string) => {
    onCreateFolder(name, currentFolderId);
    setIsCreateFolderModalOpen(false);
  };

  const BreadcrumbDroppable = ({ id, name, isRoot }: { id: string | null, name: string, isRoot: boolean }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: isRoot ? 'root-drop' : `folder-drop-${id}`,
      data: { type: 'folder-drop', id }
    });
    
    return (
      <span 
        ref={setNodeRef}
        className={`cursor-pointer px-1.5 py-0.5 rounded transition-colors ${isOver ? 'bg-cyan-500/20 text-cyan-500' : 'hover:text-[var(--text-primary)]'}`} 
        onClick={() => onFolderChange(id)}
      >
        {name}
      </span>
    );
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
    <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm h-full min-h-[500px]">
      
      {/* Header & Toolbar */}
      <div className="p-4 border-b border-[var(--border-color)] flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 w-full max-w-md">
            <h2 className="text-xl font-bold text-[var(--text-primary)] hidden lg:block">DATA WORKSPACE</h2>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input 
                type="text" 
                placeholder="Search datasets, folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center relative">
            <div className="flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)] mr-2 hidden sm:flex">
              <BreadcrumbDroppable id={null} name="Repository" isRoot={true} />
              {breadcrumbs.map((crumb) => (
                <React.Fragment key={crumb.id}>
                  <ChevronRight className="w-4 h-4" />
                  <BreadcrumbDroppable id={crumb.id} name={crumb.name} isRoot={false} />
                </React.Fragment>
              ))}
            </div>
            
            <div>
              <button 
                ref={filterBtnRef}
                onClick={handleFilterClick}
                className={`p-2 border rounded-lg transition-colors ${activeFilter !== 'all' ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10' : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-color)]'}`}
              >
                <Filter className="w-4 h-4" />
              </button>
              
              {showFilterMenu && typeof document !== 'undefined' && createPortal(
                <div 
                  id="filter-popover-content"
                  style={{ top: filterMenuPos.top, right: filterMenuPos.right, zIndex: 9999 }}
                  className="fixed w-48 bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Filter by Format
                  </div>
                  <button onClick={() => { setActiveFilter('all'); setShowFilterMenu(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-color)] transition-colors ${activeFilter === 'all' ? 'text-cyan-500 font-medium' : 'text-[var(--text-primary)]'}`}>All Formats</button>
                  <button onClick={() => { setActiveFilter('csv'); setShowFilterMenu(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-color)] transition-colors ${activeFilter === 'csv' ? 'text-cyan-500 font-medium' : 'text-[var(--text-primary)]'}`}>CSV Files</button>
                  <button onClick={() => { setActiveFilter('json'); setShowFilterMenu(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-color)] transition-colors ${activeFilter === 'json' ? 'text-cyan-500 font-medium' : 'text-[var(--text-primary)]'}`}>JSON Files</button>
                  <button onClick={() => { setActiveFilter('excel'); setShowFilterMenu(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-color)] transition-colors ${activeFilter === 'excel' ? 'text-cyan-500 font-medium' : 'text-[var(--text-primary)]'}`}>Excel (XLSX)</button>
                </div>,
                document.body
              )}
            </div>

            <button onClick={onRefresh} className="p-2 border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-color)] transition-colors">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-500' : ''}`} />
            </button>
            {canEdit && (
              <>
                <button onClick={() => setIsCreateFolderModalOpen(true)} className="flex items-center gap-1.5 px-3 py-2 border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-color)] text-sm font-semibold transition-colors">
                  <Plus className="w-4 h-4" /> New Folder
                </button>
                <button onClick={onUploadClick} className="flex items-center gap-1.5 px-3 py-2 bg-[var(--text-primary)] text-[var(--bg-color)] rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                  <UploadCloud className="w-4 h-4" /> Upload
                </button>
                <button onClick={onConnectClick} className="flex items-center gap-1.5 px-3 py-2 bg-[var(--card-color)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg text-sm font-semibold hover:border-cyan-500 transition-colors">
                  <Globe className="w-4 h-4" /> Connect
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto">
        {((filteredDatasets.length === 0) && (filteredFolders.length === 0)) ? (
          (searchQuery || activeFilter !== 'all') ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-[var(--bg-color)] flex items-center justify-center">
                <Search className="w-12 h-12 text-[var(--text-secondary)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No results found</h3>
              <p className="text-[var(--text-secondary)] max-w-sm mb-6">
                No datasets or folders match your current filter and search query.
              </p>
              <button onClick={() => { setSearchQuery(""); setActiveFilter('all'); }} className="px-5 py-2.5 bg-[var(--text-primary)] text-[var(--bg-color)] rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Database className="w-12 h-12 text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No datasets found</h3>
              <p className="text-[var(--text-secondary)] max-w-sm mb-6">
                Upload files or connect a remote source to start building your repository.
              </p>
              <div className="flex gap-4 justify-center">
                <button onClick={onUploadClick} className="px-5 py-2.5 bg-[var(--text-primary)] text-[var(--bg-color)] rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Upload Files
                </button>
                <button onClick={onConnectClick} className="px-5 py-2.5 bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg font-semibold hover:bg-[var(--border-color)] transition-colors">
                  Connect Source
                </button>
              </div>
            </div>
          )
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold hidden sm:table-cell">Type</th>
                <th className="px-6 py-4 font-semibold hidden md:table-cell">Source</th>
                <th className="px-6 py-4 font-semibold hidden lg:table-cell">Size</th>
                <th className="px-6 py-4 font-semibold hidden xl:table-cell">Rows</th>
                <th className="px-6 py-4 font-semibold hidden sm:table-cell">Updated</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
               {filteredFolders.map((folder) => (
                <FolderRow 
                  key={folder.id} 
                  folder={folder} 
                  onClick={onFolderChange}
                  onRename={canEdit ? (f: FolderNode) => setRenameFolderTarget(f) : undefined}
                  onDelete={canEdit ? (id: string) => onDeleteFolder && onDeleteFolder(id) : undefined}
                />
              ))}

              {filteredDatasets.map((dataset) => (
                <DatasetRow 
                  key={dataset.id} 
                  dataset={dataset} 
                  onClick={onSelectDataset}
                  onRename={canEdit ? (d: Dataset) => setRenameDatasetTarget(d) : undefined}
                  onDelete={canEdit ? (id: string) => onDeleteDataset(id) : undefined}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    
    <CreateFolderModal isOpen={isCreateFolderModalOpen} onClose={() => setIsCreateFolderModalOpen(false)} onSubmit={handleCreateFolderSubmit} isLoading={isLoading} />
    <RenameFolderModal isOpen={!!renameFolderTarget} onClose={() => setRenameFolderTarget(null)} onSubmit={(newName) => { if(renameFolderTarget && onRenameFolder) onRenameFolder(renameFolderTarget.id, newName); setRenameFolderTarget(null); }} initialName={renameFolderTarget?.name || ''} isLoading={isLoading} />
    <RenameDatasetModal isOpen={!!renameDatasetTarget} onClose={() => setRenameDatasetTarget(null)} onSubmit={(newName) => { if(renameDatasetTarget && onRenameDataset) onRenameDataset(renameDatasetTarget.id, newName); setRenameDatasetTarget(null); }} initialName={renameDatasetTarget?.original_filename || renameDatasetTarget?.filename || ''} isLoading={isLoading} />
    </DndContext>
  );
}
