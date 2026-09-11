import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CellItem, MaterialMode, ViewMode, CellCyclePhase } from '../types';
import { createOrganelleMaterial } from '../lib/cellMaterials';

interface CellModelsProps {
  cell: CellItem;
  selectedOrganelleId: string;
  onSelectOrganelle: (id: string) => void;
  viewMode: ViewMode;
  materialMode: MaterialMode;
  crossSection: boolean;
  timeLapseActive: boolean;
  cyclePhase: CellCyclePhase;
  hiddenOrganelleIds: string[];
}

export const CellModels: React.FC<CellModelsProps> = ({
  cell,
  selectedOrganelleId,
  onSelectOrganelle,
  viewMode,
  materialMode,
  crossSection,
  timeLapseActive,
  cyclePhase,
  hiddenOrganelleIds,
}) => {
  // Real-time clipping plane for cross-section slice
  const clippingPlane = useMemo(() => {
    if (!crossSection) return null;
    return new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.1);
  }, [crossSection]);

  const getOrganelleProps = (orgId: string, defaultColor: string, isTranslucent = false) => {
    const isSelected = selectedOrganelleId === orgId;
    const isDimmed = viewMode === 'focus' && !isSelected;
    const isHidden = hiddenOrganelleIds.includes(orgId);

    const material = createOrganelleMaterial({
      color: defaultColor,
      isSelected,
      isDimmed,
      materialMode,
      clippingPlane,
      isTranslucent,
    });

    return {
      material,
      visible: !isHidden,
      onClick: (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        onSelectOrganelle(orgId);
      },
    };
  };

  // Mitosis animated offsets based on cycle phase
  const mitosisChromosomeOffset = useMemo(() => {
    if (!timeLapseActive) return 0;
    switch (cyclePhase) {
      case 'interphase':
        return 0;
      case 'prophase':
        return 0.05;
      case 'metaphase':
        return 0;
      case 'anaphase':
        return 0.7;
      case 'telophase':
        return 1.1;
      default:
        return 0;
    }
  }, [timeLapseActive, cyclePhase]);

  // Render specific cell model based on modelKind
  switch (cell.modelKind) {
    case 'plant':
      return (
        <group>
          {/* Rigid Polygonal Cell Wall */}
          <mesh {...getOrganelleProps('cell_wall', '#059669', true)}>
            <boxGeometry args={[2.8, 2.3, 1.8]} />
          </mesh>

          {/* Large Central Vacuole */}
          <mesh position={[-0.2, -0.2, 0]} {...getOrganelleProps('central_vacuole', '#06b6d4', true)}>
            <sphereGeometry args={[0.95, 32, 32]} />
          </mesh>

          {/* Plant Nucleus */}
          <group position={[-0.85, 0.65, -0.2]}>
            <mesh {...getOrganelleProps('nucleus', '#818cf8')}>
              <sphereGeometry args={[0.42, 28, 28]} />
            </mesh>
            <mesh position={[0.08, 0.05, 0.08]} {...getOrganelleProps('nucleus', '#c084fc')}>
              <sphereGeometry args={[0.16, 16, 16]} />
            </mesh>
          </group>

          {/* Chloroplasts */}
          <group>
            {[
              [0.85, 0.45, 0.4],
              [0.9, -0.5, 0.3],
              [-0.7, -0.6, 0.4],
              [0.3, 0.75, -0.3],
              [-0.2, 0.8, 0.4],
              [0.85, 0.1, -0.4],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]} rotation={[0.4 * idx, 0.6 * idx, 0.2]} {...getOrganelleProps('chloroplast', '#10b981')}>
                <cylinderGeometry args={[0.26, 0.26, 0.14, 20]} />
              </mesh>
            ))}
          </group>

          {/* Mitochondria */}
          <group>
            {[
              [0.6, -0.7, 0.45],
              [-0.6, 0.2, 0.5],
              [0.4, -0.3, -0.5],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]} rotation={[0.5 * idx, 0.3, 0.8]} {...getOrganelleProps('mitochondria', '#f59e0b')}>
                <capsuleGeometry args={[0.12, 0.28, 8, 16]} />
              </mesh>
            ))}
          </group>
        </group>
      );

    case 'neuron':
      return (
        <group>
          {/* Soma (Perikaryon) */}
          <mesh position={[0, 0.2, 0]} {...getOrganelleProps('soma', '#f59e0b')}>
            <icosahedronGeometry args={[0.75, 2]} />
          </mesh>

          {/* Nucleus inside soma */}
          <mesh position={[0, 0.2, 0]} {...getOrganelleProps('soma', '#fbbf24')}>
            <sphereGeometry args={[0.35, 24, 24]} />
          </mesh>

          {/* Dendrites radiating from soma */}
          <group>
            {[
              [-0.7, 0.8, -0.2],
              [-0.9, 0.5, 0.3],
              [-0.4, 1.0, 0.1],
              [-0.8, -0.2, -0.4],
              [-0.5, 0.7, -0.6],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]} rotation={[0.4 * idx, 0.7 * idx, -0.3 * idx]} {...getOrganelleProps('dendrites', '#ea580c')}>
                <cylinderGeometry args={[0.04, 0.12, 0.8, 8]} />
              </mesh>
            ))}
          </group>

          {/* Axon Cable */}
          <mesh position={[0.75, -0.6, 0.3]} rotation={[0.4, 0.2, -0.85]} {...getOrganelleProps('axon', '#fbbf24')}>
            <cylinderGeometry args={[0.08, 0.08, 2.2, 16]} />
          </mesh>

          {/* Myelin Sheath Beads */}
          <group>
            {[
              [0.4, -0.25, 0.15],
              [0.85, -0.7, 0.35],
              [1.3, -1.15, 0.55],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]} rotation={[0.4, 0.2, -0.85]} {...getOrganelleProps('myelin', '#a855f7')}>
                <cylinderGeometry args={[0.18, 0.18, 0.42, 16]} />
              </mesh>
            ))}
          </group>

          {/* Synaptic Vesicles / Terminal Bouton */}
          <mesh position={[1.55, -1.4, 0.7]} {...getOrganelleProps('synaptic_vesicles', '#ec4899')}>
            <sphereGeometry args={[0.22, 16, 16]} />
          </mesh>
        </group>
      );

    case 'whiteBlood':
      return (
        <group>
          {/* Deformed Phagocytic Amoeboid Membrane */}
          <mesh {...getOrganelleProps('cytoskeleton', '#8b5cf6', true)}>
            <sphereGeometry args={[1.5, 32, 32]} />
          </mesh>

          {/* Multi-lobed Nucleus (3 connected lobes) */}
          <group position={[0, 0, 0]}>
            <mesh position={[-0.35, 0.15, 0]} {...getOrganelleProps('nucleus', '#7c3aed')}>
              <sphereGeometry args={[0.38, 20, 20]} />
            </mesh>
            <mesh position={[0.35, 0.2, 0.1]} {...getOrganelleProps('nucleus', '#7c3aed')}>
              <sphereGeometry args={[0.34, 20, 20]} />
            </mesh>
            <mesh position={[0, -0.35, -0.1]} {...getOrganelleProps('nucleus', '#7c3aed')}>
              <sphereGeometry args={[0.36, 20, 20]} />
            </mesh>
            {/* Connecting nuclear chromatin bridge */}
            <mesh position={[0, 0, 0]} {...getOrganelleProps('nucleus', '#6d28d9')}>
              <torusGeometry args={[0.32, 0.08, 12, 24]} />
            </mesh>
          </group>

          {/* Phagosome with Engulfed Prey */}
          <group position={[0.65, -0.4, 0.45]}>
            <mesh {...getOrganelleProps('phagosome', '#ef4444')}>
              <sphereGeometry args={[0.32, 20, 20]} />
            </mesh>
            {/* Ingested bacterial rod inside */}
            <mesh position={[0, 0, 0]} rotation={[0.4, 0.3, 0]}>
              <capsuleGeometry args={[0.07, 0.18, 6, 12]} />
              <meshStandardMaterial color="#f43f5e" roughness={0.4} />
            </mesh>
          </group>

          {/* Granules */}
          <group>
            {[
              [-0.6, 0.5, -0.3],
              [-0.5, -0.4, 0.5],
              [0.5, 0.6, -0.2],
              [-0.7, -0.2, -0.4],
              [0.3, -0.7, -0.3],
              [0.8, 0.2, 0.4],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]} {...getOrganelleProps('granules', '#c084fc')}>
                <sphereGeometry args={[0.1, 12, 12]} />
              </mesh>
            ))}
          </group>
        </group>
      );

    case 'bacteria':
      return (
        <group>
          {/* Cylindrical Capsule / Peptidoglycan Cell Envelope */}
          <mesh rotation={[0, 0, Math.PI / 2]} {...getOrganelleProps('cell_envelope', '#f43f5e', true)}>
            <capsuleGeometry args={[0.65, 1.8, 16, 28]} />
          </mesh>

          {/* Non-membranous tangled Nucleoid */}
          <group position={[0, 0, 0]}>
            <mesh {...getOrganelleProps('nucleoid', '#ec4899')}>
              <torusKnotGeometry args={[0.35, 0.1, 64, 16, 2, 3]} />
            </mesh>
          </group>

          {/* 70S Ribosomes */}
          <group>
            {[
              [-0.4, 0.3, 0.2],
              [0.4, -0.3, -0.2],
              [-0.6, -0.2, 0.1],
              [0.6, 0.2, 0.25],
              [-0.2, 0.35, -0.25],
              [0.2, 0.35, 0.25],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]} {...getOrganelleProps('ribosome', '#fb7185')}>
                <sphereGeometry args={[0.07, 10, 10]} />
              </mesh>
            ))}
          </group>

          {/* Helical Flagella */}
          <group position={[-1.2, 0, 0]}>
            <mesh rotation={[0, 0, -Math.PI / 2]} {...getOrganelleProps('flagellum', '#fbbf24')}>
              <cylinderGeometry args={[0.03, 0.03, 2.2, 12]} />
            </mesh>
            <mesh position={[-1.1, 0.2, 0]} rotation={[0.2, 0.3, -1.2]} {...getOrganelleProps('flagellum', '#fbbf24')}>
              <cylinderGeometry args={[0.025, 0.025, 1.8, 12]} />
            </mesh>
          </group>
        </group>
      );

    case 'epithelial':
      return (
        <group>
          {/* Columnar Cell Body */}
          <mesh position={[0, 0, 0]} {...getOrganelleProps('junctions', '#38bdf8', true)}>
            <boxGeometry args={[1.5, 2.0, 1.2]} />
          </mesh>

          {/* Basal Nucleus */}
          <mesh position={[0, -0.4, 0]} {...getOrganelleProps('nucleus', '#818cf8')}>
            <sphereGeometry args={[0.42, 24, 24]} />
          </mesh>

          {/* Subapical Mitochondria */}
          <group>
            {[
              [0.35, 0.55, 0.25],
              [-0.35, 0.55, -0.25],
              [0, 0.6, 0],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]} {...getOrganelleProps('mitochondria', '#f97316')}>
                <capsuleGeometry args={[0.1, 0.22, 6, 12]} />
              </mesh>
            ))}
          </group>

          {/* Apical Cilia Lawn */}
          <group position={[0, 1.0, 0]}>
            {Array.from({ length: 24 }).map((_, idx) => {
              const row = Math.floor(idx / 6) - 1.5;
              const col = (idx % 6) - 2.5;
              const sway = Math.sin(idx * 0.8) * 0.15;
              return (
                <mesh
                  key={idx}
                  position={[col * 0.22, 0.35, row * 0.25]}
                  rotation={[sway, 0, sway * 0.5]}
                  {...getOrganelleProps('cilia', '#06b6d4')}
                >
                  <cylinderGeometry args={[0.022, 0.03, 0.7, 8]} />
                </mesh>
              );
            })}
          </group>
        </group>
      );

    case 'muscle':
      return (
        <group>
          {/* Striated Muscle Myofibril Cylinders */}
          <group>
            {[-0.4, 0, 0.4].map((y, idx) => (
              <mesh key={idx} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]} {...getOrganelleProps('sarcomere', '#ef4444')}>
                <cylinderGeometry args={[0.45, 0.45, 2.8, 24]} />
              </mesh>
            ))}
          </group>

          {/* Transverse Z-Disc Bands */}
          <group>
            {[-1.0, -0.5, 0, 0.5, 1.0].map((x, idx) => (
              <mesh key={idx} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} {...getOrganelleProps('sarcomere', '#b91c1c')}>
                <cylinderGeometry args={[0.47, 0.47, 0.06, 24]} />
              </mesh>
            ))}
          </group>

          {/* Sarcoplasmic Reticulum Sleeves */}
          <mesh position={[-0.4, 0.5, 0.3]} {...getOrganelleProps('sarcoplasmic_reticulum', '#3b82f6')}>
            <torusGeometry args={[0.48, 0.06, 12, 28]} />
          </mesh>

          {/* Intermyofibrillar Mitochondria */}
          <group>
            {[
              [0.75, -0.4, 0.35],
              [-0.75, 0.4, 0.35],
              [0.2, 0.4, -0.35],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]} {...getOrganelleProps('mitochondria', '#f97316')}>
                <capsuleGeometry args={[0.12, 0.28, 8, 16]} />
              </mesh>
            ))}
          </group>

          {/* Peripheral Nuclei */}
          <mesh position={[-0.85, -0.65, -0.2]} {...getOrganelleProps('peripheral_nuclei', '#818cf8')}>
            <sphereGeometry args={[0.26, 18, 18]} />
          </mesh>
        </group>
      );

    case 'animal':
    default:
      return (
        <group>
          {/* Plasma Membrane Fluid Bilayer */}
          <mesh position={[0, 0, 0]} {...getOrganelleProps('plasma_membrane', '#2dd4bf', true)}>
            <sphereGeometry args={[1.65, 36, 36]} />
          </mesh>

          {/* Central Nucleus & Nucleolus (with Mitosis Phase Animation) */}
          <group position={[0, 0, 0]}>
            {/* When in Anaphase / Telophase, split into two poles */}
            <group position={[-mitosisChromosomeOffset, 0, 0]}>
              <mesh {...getOrganelleProps('nucleus', '#818cf8')}>
                <sphereGeometry args={[0.55, 32, 32]} />
              </mesh>
              <mesh position={[0.15, 0.1, 0.15]} {...getOrganelleProps('nucleolus', '#c084fc')}>
                <sphereGeometry args={[0.2, 20, 20]} />
              </mesh>
            </group>

            {mitosisChromosomeOffset > 0 && (
              <group position={[mitosisChromosomeOffset, 0, 0]}>
                <mesh {...getOrganelleProps('nucleus', '#818cf8')}>
                  <sphereGeometry args={[0.5, 32, 32]} />
                </mesh>
                <mesh position={[-0.15, 0.1, 0.15]} {...getOrganelleProps('nucleolus', '#c084fc')}>
                  <sphereGeometry args={[0.18, 20, 20]} />
                </mesh>
              </group>
            )}
          </group>

          {/* Mitochondria with cristae */}
          <group>
            {[
              [0.9, -0.4, 0.5],
              [-0.8, -0.5, -0.4],
              [0.6, 0.7, -0.5],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]} rotation={[0.4 * idx, 0.7 * idx, 0.5]} {...getOrganelleProps('mitochondria', '#f97316')}>
                <capsuleGeometry args={[0.15, 0.35, 8, 16]} />
              </mesh>
            ))}
          </group>

          {/* Rough ER Sheets */}
          <group position={[-0.65, 0.5, 0.4]}>
            <mesh rotation={[0.4, 0.8, 0]} {...getOrganelleProps('rough_er', '#38bdf8')}>
              <torusGeometry args={[0.45, 0.1, 16, 32, Math.PI * 1.4]} />
            </mesh>
            <mesh position={[0, 0.1, 0.1]} rotation={[0.6, 0.9, 0.2]} {...getOrganelleProps('rough_er', '#38bdf8')}>
              <torusGeometry args={[0.32, 0.08, 16, 28, Math.PI * 1.2]} />
            </mesh>
          </group>

          {/* Golgi Apparatus stacks */}
          <group position={[0.75, 0.55, -0.45]}>
            {[-0.1, 0, 0.1].map((offset, idx) => (
              <mesh key={idx} position={[0, offset, 0]} rotation={[0.3, 0.2, 0.4]} {...getOrganelleProps('golgi', '#eab308')}>
                <torusGeometry args={[0.38 - idx * 0.05, 0.06, 12, 28, Math.PI]} />
              </mesh>
            ))}
          </group>

          {/* Lysosomes */}
          <group>
            {[
              [-0.85, -0.6, 0.25],
              [0.7, -0.8, -0.2],
              [-0.2, 0.9, -0.4],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]} {...getOrganelleProps('lysosome', '#ef4444')}>
                <sphereGeometry args={[0.13, 16, 16]} />
              </mesh>
            ))}
          </group>
        </group>
      );
  }
};
