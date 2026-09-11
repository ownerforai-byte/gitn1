import React, { useState, useMemo } from 'react';
import { X, BookOpen, Search, Filter, Sparkles } from 'lucide-react';
import { CELL_SPECIMENS } from '../../data/cells';
import { OrganelleItem } from '../../types';
import { useEscapeToClose } from '../../hooks/useEscapeToClose';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrganelleAndCell: (cellId: string, organelleId: string) => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectOrganelleAndCell,
}) => {
  useEscapeToClose(isOpen, onClose);

  const [query, setQuery] = useState('');

  // Flatten all unique organelles
  const allOrganelles = useMemo(() => {
    const list: { cellId: string; cellName: string; organelle: OrganelleItem }[] = [];
    CELL_SPECIMENS.forEach((c) => {
      c.organelles.forEach((org) => {
        list.push({ cellId: c.id, cellName: c.name, organelle: org });
      });
    });
    return list;
  }, []);

  const filtered = useMemo(() => {
    return allOrganelles.filter(({ cellName, organelle }) => {
      const q = query.toLowerCase();
      return (
        organelle.name.toLowerCase().includes(q) ||
        organelle.subtitle.toLowerCase().includes(q) ||
        organelle.attributes.function.toLowerCase().includes(q) ||
        cellName.toLowerCase().includes(q)
      );
    });
  }, [allOrganelles, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Cytology Reference Encyclopedia
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Comprehensive dictionary of organelles, macromolecular complexes, and membranes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search organelle function, membrane type, or biochemistry..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
          {filtered.map(({ cellId, cellName, organelle }, idx) => (
            <div
              key={`${cellId}-${organelle.id}-${idx}`}
              onClick={() => {
                onSelectOrganelleAndCell(cellId, organelle.id);
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 hover:border-indigo-400 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: organelle.color }}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {organelle.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{organelle.subtitle}</p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {cellName}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {organelle.attributes.function}
              </p>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Membrane: {organelle.attributes.membrane}</span>
                <span>Size: {organelle.attributes.diameter}</span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No structures match your search term.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
