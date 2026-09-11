import React from 'react';
import { Html } from '@react-three/drei';
import { CellItem } from '../types';

interface CalloutLabelsProps {
  cell: CellItem;
  selectedOrganelleId: string;
  onSelectOrganelle: (id: string) => void;
  showLabels: boolean;
  hiddenOrganelleIds: string[];
}

export const CalloutLabels: React.FC<CalloutLabelsProps> = ({
  cell,
  selectedOrganelleId,
  onSelectOrganelle,
  showLabels,
  hiddenOrganelleIds,
}) => {
  if (!showLabels) return null;

  return (
    <group>
      {cell.organelles.map((org) => {
        if (hiddenOrganelleIds.includes(org.id)) return null;

        const isSelected = selectedOrganelleId === org.id;
        const [x, y, z] = org.location3d;

        return (
          <group key={org.id} position={[x, y, z]}>
            <Html
              center
              distanceFactor={8}
              zIndexRange={[100, 0]}
              style={{
                pointerEvents: 'auto',
                userSelect: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOrganelle(org.id);
                }}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 backdrop-blur-md border shadow-lg ${
                  isSelected
                    ? 'bg-slate-900/90 text-white border-blue-400 scale-110 shadow-blue-500/25 ring-2 ring-blue-500/40'
                    : 'bg-slate-900/70 text-slate-200 border-slate-700/80 hover:bg-slate-800/90 hover:border-slate-500 hover:scale-105'
                }`}
                title={`Select ${org.name}`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
                  style={{ backgroundColor: org.color }}
                />
                <span className="whitespace-nowrap font-semibold tracking-tight">{org.name}</span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
