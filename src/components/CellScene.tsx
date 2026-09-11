import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import {
  CellItem,
  MaterialMode,
  ViewMode,
  ZoomPreset,
  CellCyclePhase,
} from '../types';
import { CellModels } from './CellModels';
import { CalloutLabels } from './CalloutLabels';

interface CellSceneProps {
  cell: CellItem;
  selectedOrganelleId: string;
  onSelectOrganelle: (id: string) => void;
  viewMode: ViewMode;
  materialMode: MaterialMode;
  crossSection: boolean;
  autoRotate: boolean;
  zoomPreset: ZoomPreset;
  timeLapseActive: boolean;
  cyclePhase: CellCyclePhase;
  hiddenOrganelleIds: string[];
  showCalloutLabels: boolean;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

// Camera transition controller for smooth zoom presets
const CameraController: React.FC<{
  zoomPreset: ZoomPreset;
  selectedOrganelleLocation?: [number, number, number];
}> = ({ zoomPreset, selectedOrganelleLocation }) => {
  const targetDistanceRef = useRef(5.8);
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    switch (zoomPreset) {
      case '1x':
        targetDistanceRef.current = 5.8;
        targetLookAtRef.current.set(0, 0, 0);
        break;
      case '10x':
        targetDistanceRef.current = 3.6;
        if (selectedOrganelleLocation) {
          targetLookAtRef.current.set(
            selectedOrganelleLocation[0] * 0.4,
            selectedOrganelleLocation[1] * 0.4,
            selectedOrganelleLocation[2] * 0.4
          );
        }
        break;
      case '40x':
        targetDistanceRef.current = 2.0;
        if (selectedOrganelleLocation) {
          targetLookAtRef.current.set(
            selectedOrganelleLocation[0] * 0.8,
            selectedOrganelleLocation[1] * 0.8,
            selectedOrganelleLocation[2] * 0.8
          );
        }
        break;
      case '100x':
        targetDistanceRef.current = 1.15;
        if (selectedOrganelleLocation) {
          targetLookAtRef.current.set(
            selectedOrganelleLocation[0],
            selectedOrganelleLocation[1],
            selectedOrganelleLocation[2]
          );
        }
        break;
    }
  }, [zoomPreset, selectedOrganelleLocation]);

  useFrame((state) => {
    const camera = state.camera;
    const currentDist = camera.position.length();
    const targetDist = targetDistanceRef.current;

    // Smooth interpolation towards target distance
    if (Math.abs(currentDist - targetDist) > 0.01) {
      const dir = camera.position.clone().normalize();
      const newDist = THREE.MathUtils.lerp(currentDist, targetDist, 0.08);
      camera.position.copy(dir.multiplyScalar(newDist));
    }
  });

  return null;
};

export const CellScene: React.FC<CellSceneProps> = ({
  cell,
  selectedOrganelleId,
  onSelectOrganelle,
  viewMode,
  materialMode,
  crossSection,
  autoRotate,
  zoomPreset,
  timeLapseActive,
  cyclePhase,
  hiddenOrganelleIds,
  showCalloutLabels,
  onCanvasReady,
}) => {
  const activeOrganelle = cell.organelles.find((o) => o.id === selectedOrganelleId);

  return (
    <div className="w-full h-full relative overflow-hidden bg-radial from-slate-900/60 via-slate-950 to-neutral-950 select-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.2, 5.8], fov: 38 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: materialMode === 'solid' ? 1.0 : 1.25,
          localClippingEnabled: true,
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl }) => {
          if (onCanvasReady) {
            onCanvasReady(gl.domElement);
          }
        }}
      >
        <CameraController
          zoomPreset={zoomPreset}
          selectedOrganelleLocation={activeOrganelle?.location3d}
        />

        {/* Studio lighting suite */}
        <ambientLight intensity={materialMode === 'solid' ? 0.8 : 0.6} />
        <hemisphereLight
          args={['#e0f2fe', '#090d16', materialMode === 'studio' ? 0.7 : 0.45]}
        />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        <spotLight
          position={[-6, 5, 4]}
          intensity={0.7}
          angle={0.6}
          penumbra={0.8}
          color="#38bdf8"
        />
        <pointLight position={[0, -3, -2]} intensity={0.4} color="#ec4899" />

        {/* Gentle floating motion */}
        <Float speed={timeLapseActive ? 3.0 : 1.2} rotationIntensity={0.2} floatIntensity={0.3}>
          <group>
            <CellModels
              cell={cell}
              selectedOrganelleId={selectedOrganelleId}
              onSelectOrganelle={onSelectOrganelle}
              viewMode={viewMode}
              materialMode={materialMode}
              crossSection={crossSection}
              timeLapseActive={timeLapseActive}
              cyclePhase={cyclePhase}
              hiddenOrganelleIds={hiddenOrganelleIds}
            />

            <CalloutLabels
              cell={cell}
              selectedOrganelleId={selectedOrganelleId}
              onSelectOrganelle={onSelectOrganelle}
              showLabels={showCalloutLabels}
              hiddenOrganelleIds={hiddenOrganelleIds}
            />
          </group>
        </Float>

        {/* Ground shadow plane */}
        <ContactShadows
          position={[0, -2.1, 0]}
          opacity={0.65}
          scale={7}
          blur={2.5}
          far={3.5}
          color="#030712"
        />

        <Environment preset="studio" />

        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          minDistance={0.8}
          maxDistance={9.5}
          enablePan
        />
      </Canvas>
    </div>
  );
};
