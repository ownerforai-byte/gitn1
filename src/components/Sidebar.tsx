import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  Filter,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { CellItem, OrganelleItem } from '../types';

interface SidebarProps {
  cell: CellItem;
  selectedOrganelleId: string;
  onSelectOrganelle: (id: string) => void;
  hiddenOrganelleIds: string[];
  onToggleOrganelleVisibility: (id: string) => void;
  onShowAllOrganelles: () => void;
  onHideAllOrganelles: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  cell,
  selectedOrganelleId,
  onSelectOrganelle,
  hiddenOrganelleIds,
  onToggleOrganelleVisibility,
  onShowAllOrganelles,
  onHideAllOrganelles,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  const filteredOrganelles = useMemo(() => {
    return cell.organelles.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

      const isHidden = hiddenOrganelleIds.includes(org.id);

      if (visibilityFilter === 'visible') return matchesSearch && !isHidden;
      if (visibilityFilter === 'hidden') return matchesSearch && isHidden;
      return matchesSearch;
    });
  }, [cell.organelles, searchQuery, visibilityFilter, hiddenOrganelleIds]);

  return (
    <aside
      id="organelle-sidebar"
      className="w-64 sm:w-72 border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md flex flex-col h-full transition-colors z-10"
    >
      {/* Specimen Title Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow-xs"
            style={{ backgroundColor: cell.accentColor }}
          />
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {cell.name}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              {cell.scientificName}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
          {cell.organelles.length} structures
        </span>
      </div>

      {/* Organelle Search & Filter Bar */}
      <div className="p-2.5 border-b border-slate-100 dark:border-slate-900 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organelle or structure..."
            className="w-full pl-8 pr-2.5 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
          />
        </div>

        {/* View filter segmented control */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800">
            {(['all', 'visible', 'hidden'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setVisibilityFilter(filter)}
                className={`px-2 py-0.5 rounded-md font-medium capitalize transition-colors ${
                  visibilityFilter === filter
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onShowAllOrganelles}
              className="p-1 hover:text-blue-600 dark:hover:text-blue-400 text-slate-400"
              title="Show All Organelles"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onHideAllOrganelles}
              className="p-1 hover:text-rose-600 dark:hover:text-rose-400 text-slate-400"
              title="Hide All Except Selected"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Organelle List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
        {filteredOrganelles.map((org) => {
          const isSelected = selectedOrganelleId === org.id;
          const isHidden = hiddenOrganelleIds.includes(org.id);

          return (
            <div
              key={org.id}
              onClick={() => onSelectOrganelle(org.id)}
              className={`group flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500/80 text-blue-900 dark:text-blue-200 shadow-xs'
                  : 'bg-white/60 dark:bg-slate-900/50 border-transparent hover:border-slate-200 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
              } ${isHidden ? 'opacity-50' : 'opacity-100'}`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {/* Color Dot indicator */}
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: org.color }}
                />

                <div className="overflow-hidden text-left">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-semibold truncate">{org.name}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {org.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleOrganelleVisibility(org.id);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  title={isHidden ? 'Unhide organelle' : 'Hide organelle'}
                >
                  {isHidden ? (
                    <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
                <ChevronRight
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    isSelected ? 'rotate-90 text-blue-500' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          );
        })}

        {filteredOrganelles.length === 0 && (
          <div className="py-8 text-center text-slate-400 text-xs">
            No organelles match your filter criteria.
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Organelles visible</span>
        <span className="font-mono">
          {cell.organelles.length - hiddenOrganelleIds.length} / {cell.organelles.length}
        </span>
      </div>
    </aside>
  );
};
