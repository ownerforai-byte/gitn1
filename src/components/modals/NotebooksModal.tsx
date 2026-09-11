import React, { useState, useRef } from 'react';
import {
  X,
  BookOpen,
  Plus,
  Trash2,
  Download,
  Upload,
  Printer,
  Tag,
  Save,
  Clock,
} from 'lucide-react';
import { CellId, NotebookEntry } from '../../types';
import { CELL_SPECIMENS } from '../../data/cells';
import { STORAGE_KEYS } from '../../lib/storageKeys';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useEscapeToClose } from '../../hooks/useEscapeToClose';
import {
  exportNotebooksAsJson,
  exportNotebookAsPrintablePdf,
} from '../../lib/download';

interface NotebooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCellId: CellId;
  onAwardXp: (amount: number) => void;
}

export const NotebooksModal: React.FC<NotebooksModalProps> = ({
  isOpen,
  onClose,
  currentCellId,
  onAwardXp,
}) => {
  useEscapeToClose(isOpen, onClose);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notebooks, setNotebooks] = useLocalStorage<NotebookEntry[]>(
    STORAGE_KEYS.NOTEBOOKS,
    [
      {
        cellId: 'animal',
        title: 'Mitochondrial Cristae Observations',
        content:
          'Under high-resolution TEM, the inner mitochondrial membrane exhibits distinct lamellar cristae folds. In hepatocytes, these folds maximize surface area for ATP synthase F0F1 complexes. Staining with MitoTracker reveals continuous reticular fusion-fission dynamics.',
        updatedAt: Date.now() - 86400000,
        tags: ['mitochondria', 'metabolism', 'TEM'],
      },
      {
        cellId: 'plant',
        title: 'Chloroplast Stroma & RuBisCO Crystals',
        content:
          'Observed cytoplasmic streaming carrying disc chloroplasts around the massive central vacuole in Elodea mesophyll. RuBisCO constitutes the principal soluble stroma enzyme. Exposure to elevated light prompts protective perpendicular orientation along cell walls.',
        updatedAt: Date.now() - 43200000,
        tags: ['photosynthesis', 'chloroplast', 'cyclosis'],
      },
    ]
  );

  const [activeCellFilter, setActiveCellFilter] = useState<CellId | 'all'>(currentCellId);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number>(0);

  const filteredEntries = notebooks.filter((n) =>
    activeCellFilter === 'all' ? true : n.cellId === activeCellFilter
  );

  const activeEntry: NotebookEntry | undefined = filteredEntries[selectedEntryIndex];

  const handleCreateNewNote = () => {
    const targetCellId = activeCellFilter === 'all' ? currentCellId : activeCellFilter;
    const newEntry: NotebookEntry = {
      cellId: targetCellId,
      title: `Lab Observation: ${new Date().toLocaleDateString()}`,
      content: '',
      updatedAt: Date.now(),
      tags: ['cytology', 'lab'],
    };
    setNotebooks((prev) => [newEntry, ...prev]);
    setSelectedEntryIndex(0);
    onAwardXp(30);
  };

  const handleUpdateActiveNote = (updates: Partial<NotebookEntry>) => {
    if (!activeEntry) return;
    setNotebooks((prev) => {
      return prev.map((entry) => {
        if (entry === activeEntry) {
          return {
            ...entry,
            ...updates,
            updatedAt: Date.now(),
          };
        }
        return entry;
      });
    });
  };

  const handleDeleteNote = (target: NotebookEntry) => {
    if (window.confirm('Delete this notebook entry?')) {
      setNotebooks((prev) => prev.filter((e) => e !== target));
      setSelectedEntryIndex(0);
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as NotebookEntry[];
        if (Array.isArray(parsed)) {
          setNotebooks((prev) => [...parsed, ...prev]);
          alert(`Successfully imported ${parsed.length} notebook entries!`);
        }
      } catch (err) {
        alert('Failed to parse notebook JSON file.');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  const currentSpecimenName =
    CELL_SPECIMENS.find((c) => c.id === activeEntry?.cellId)?.name || 'Cell Specimen';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Cytological Laboratory Notebooks
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Document research notes, microscopy annotations, and export formatted reports
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateNewNote}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Note</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={() => exportNotebooksAsJson(notebooks)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800"
              title="Export All Notes as JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Import JSON */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800"
              title="Import Notes from JSON"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />

            {/* Print / PDF active note */}
            {activeEntry && (
              <button
                type="button"
                onClick={() => exportNotebookAsPrintablePdf(activeEntry, currentSpecimenName)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800"
                title="Print or Save active note as PDF"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Specimen Filter Pills */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Specimen:</span>
          <button
            type="button"
            onClick={() => {
              setActiveCellFilter('all');
              setSelectedEntryIndex(0);
            }}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              activeCellFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            All Specimens ({notebooks.length})
          </button>

          {CELL_SPECIMENS.map((cell) => {
            const count = notebooks.filter((n) => n.cellId === cell.id).length;
            return (
              <button
                key={cell.id}
                type="button"
                onClick={() => {
                  setActiveCellFilter(cell.id);
                  setSelectedEntryIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeCellFilter === cell.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cell.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Main Body: Sidebar List + Note Editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* Notes Sidebar List */}
          <div className="w-64 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-2 space-y-1 bg-slate-50/50 dark:bg-slate-950/20 no-scrollbar">
            {filteredEntries.map((entry, idx) => {
              const isSelected = idx === selectedEntryIndex;
              const cellObj = CELL_SPECIMENS.find((c) => c.id === entry.cellId);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedEntryIndex(idx)}
                  className={`p-2.5 rounded-xl border cursor-pointer text-left transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-sm ring-1 ring-blue-500/30'
                      : 'bg-transparent border-transparent hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cellObj?.accentColor || '#3b82f6' }}
                    />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase truncate">
                      {cellObj?.name}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {entry.title || 'Untitled Observation'}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(entry.updatedAt).toLocaleDateString()}</span>
                  </p>
                </div>
              );
            })}

            {filteredEntries.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs">
                No entries for this specimen. Click "New Note" to begin.
              </div>
            )}
          </div>

          {/* Active Note Editor */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 p-6 space-y-4">
            {activeEntry ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={activeEntry.title}
                    onChange={(e) => handleUpdateActiveNote({ title: e.target.value })}
                    placeholder="Enter observation headline..."
                    className="flex-1 text-base font-bold bg-transparent text-slate-900 dark:text-slate-100 border-b border-transparent focus:border-blue-500 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => handleDeleteNote(activeEntry)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Tags input */}
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={activeEntry.tags.join(', ')}
                    onChange={(e) =>
                      handleUpdateActiveNote({
                        tags: e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Add tags separated by comma..."
                    className="text-xs text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none w-full"
                  />
                </div>

                {/* Content text area */}
                <textarea
                  value={activeEntry.content}
                  onChange={(e) => handleUpdateActiveNote({ content: e.target.value })}
                  placeholder="Record your cytological observations, staining notes, ultrastructural findings, or hypothesis here..."
                  className="flex-1 w-full p-4 rounded-xl text-xs sm:text-sm leading-relaxed bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-sans"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Last autosaved: {new Date(activeEntry.updatedAt).toLocaleTimeString()}</span>
                  <span>{activeEntry.content.length} characters</span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                <p className="text-xs">Select an entry from the left or create a new lab note.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
