import React, { useState } from 'react';
import {
  X,
  Layers,
  ArrowRight,
  Check,
  Minus,
  Sparkles,
  GitCompare,
} from 'lucide-react';
import { CellId, CellItem } from '../../types';
import { CELL_SPECIMENS } from '../../data/cells';
import { useEscapeToClose } from '../../hooks/useEscapeToClose';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCellId: CellId;
  onSelectCell: (id: CellId) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  currentCellId,
  onSelectCell,
}) => {
  useEscapeToClose(isOpen, onClose);

  const currentCell = CELL_SPECIMENS.find((c) => c.id === currentCellId) || CELL_SPECIMENS[0];
  const [comparedCellId, setComparedCellId] = useState<CellId>(currentCell.comparisonCellId);

  const comparedCell = CELL_SPECIMENS.find((c) => c.id === comparedCellId) || CELL_SPECIMENS[1];

  if (!isOpen) return null;

  // Collect all unique organelles across both cells
  const allOrgNames = Array.from(
    new Set([
      ...currentCell.organelles.map((o) => o.name),
      ...comparedCell.organelles.map((o) => o.name),
    ])
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Comparative Cytology Studio
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Side-by-side architectural analysis and organelle difference matrix
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

        {/* Specimen Switcher Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4 bg-slate-100/50 dark:bg-slate-950/30">
          {/* Left: Specimen A */}
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: currentCell.accentColor }}
            />
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Specimen A (Active)</p>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{currentCell.name}</h4>
              <p className="text-[11px] text-slate-500">{currentCell.type}</p>
            </div>
          </div>

          {/* Right: Specimen B Dropdown */}
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: comparedCell.accentColor }}
              />
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Specimen B (Comparison)</p>
                <select
                  value={comparedCellId}
                  onChange={(e) => setComparedCellId(e.target.value as CellId)}
                  className="text-xs font-bold text-slate-900 dark:text-slate-100 bg-transparent focus:outline-none cursor-pointer"
                >
                  {CELL_SPECIMENS.filter((c) => c.id !== currentCell.id).map((c) => (
                    <option key={c.id} value={c.id} className="dark:bg-slate-900">
                      {c.name} ({c.type.split('•')[0].trim()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectCell(comparedCellId);
                onClose();
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Switch to this Cell
            </button>
          </div>
        </div>

        {/* Comparative Difference Table */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Organelle Presence & Structural Differences
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Highlighted rows represent unique evolutionary divergences between {currentCell.name} and {comparedCell.name}.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Organelle / Feature</th>
                  <th className="p-3">{currentCell.name}</th>
                  <th className="p-3">{comparedCell.name}</th>
                  <th className="p-3">Evolutionary Divergence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {allOrgNames.map((name) => {
                  const orgA = currentCell.organelles.find((o) => o.name === name);
                  const orgB = comparedCell.organelles.find((o) => o.name === name);

                  const isDifference = (orgA && !orgB) || (!orgA && orgB);

                  return (
                    <tr
                      key={name}
                      className={
                        isDifference
                          ? 'bg-amber-50/50 dark:bg-amber-950/20 font-medium'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }
                    >
                      <td className="p-3 flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: orgA?.color || orgB?.color || '#94a3b8' }}
                        />
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {name}
                        </span>
                        {isDifference && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                            Unique
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        {orgA ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <Check className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <Minus className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        {orgB ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <Check className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <Minus className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px]">
                        {orgA && orgB
                          ? 'Homologous conserved organelle with lineage-specific functional specialization.'
                          : orgA
                          ? `Exclusive to ${currentCell.name} architecture.`
                          : `Exclusive to ${comparedCell.name} architecture.`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
