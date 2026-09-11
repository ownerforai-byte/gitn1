import React from 'react';
import { X, Compass, ArrowRight, Star } from 'lucide-react';
import { CellId } from '../../types';
import { CELL_SPECIMENS } from '../../data/cells';
import { useEscapeToClose } from '../../hooks/useEscapeToClose';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCellId: CellId;
  onSelectCell: (id: CellId) => void;
  favorites: CellId[];
  onToggleFavorite: (id: CellId) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  selectedCellId,
  onSelectCell,
  favorites,
  onToggleFavorite,
}) => {
  useEscapeToClose(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Specimen Architecture Gallery
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Choose from 7 detailed 3D biological architectures across kingdoms and cell lineages
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

        {/* Specimen Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 no-scrollbar">
          {CELL_SPECIMENS.map((cell) => {
            const isSelected = cell.id === selectedCellId;
            const isFav = favorites.includes(cell.id);

            return (
              <div
                key={cell.id}
                onClick={() => {
                  onSelectCell(cell.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:scale-[1.02]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-md transition-transform group-hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${cell.accentColor}, ${cell.accentSecondary})`,
                      }}
                    >
                      {cell.name.slice(0, 1)}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(cell.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
                      title={isFav ? 'Remove favorite' : 'Add favorite'}
                    >
                      <Star
                        className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`}
                      />
                    </button>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {cell.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {cell.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    {cell.scientificName}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                    {cell.summary}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400">
                    {cell.organelles.length} structures
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
