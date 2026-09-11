import React, { useState } from 'react';
import {
  X,
  Microscope,
  Focus,
  Sun,
  Sliders,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CellId, StainingTechnique, MicroscopePreset } from '../../types';
import { CELL_SPECIMENS } from '../../data/cells';
import { MICROSCOPE_PRESETS, calculateScaleBarMicrons } from '../../lib/microscope';
import { useEscapeToClose } from '../../hooks/useEscapeToClose';

interface MicroscopePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentCellId: CellId;
  onSelectCell: (id: CellId) => void;
}

export const MicroscopePanel: React.FC<MicroscopePanelProps> = ({
  isOpen,
  onClose,
  currentCellId,
  onSelectCell,
}) => {
  useEscapeToClose(isOpen, onClose);

  const [activeSlideId, setActiveSlideId] = useState<CellId>(currentCellId);
  const [objective, setObjective] = useState<4 | 10 | 40 | 100>(10);
  const [stainMode, setStainMode] = useState<StainingTechnique>('brightfield');
  const [focusOffset, setFocusOffset] = useState<number>(0); // 0 = sharp, -10 to +10 = blur
  const [lightIntensity, setLightIntensity] = useState<number>(85);
  const [showReticle, setShowReticle] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentSlide = CELL_SPECIMENS.find((c) => c.id === activeSlideId) || CELL_SPECIMENS[0];
  const scaleBarMicrons = calculateScaleBarMicrons(objective);

  // Optical blurring calculation
  const blurAmount = Math.abs(focusOffset) * 0.7;

  // Staining filter coloration and CSS blend
  let filterCss = 'none';
  let stainLabel = 'Brightfield Unstained / H&E';
  if (stainMode === 'phase_contrast') {
    filterCss = 'contrast(160%) brightness(90%) grayscale(40%)';
    stainLabel = 'Phase Contrast Microscopy';
  } else if (stainMode === 'fluorescence') {
    filterCss = 'hue-rotate(90deg) saturate(250%) contrast(140%)';
    stainLabel = 'Immunofluorescence (DAPI / GFP / Rhodamine)';
  } else if (stainMode === 'darkfield') {
    filterCss = 'invert(90%) hue-rotate(180deg) contrast(150%)';
    stainLabel = 'Darkfield Scattering';
  } else if (stainMode === 'electron_tem') {
    filterCss = 'grayscale(100%) contrast(180%) brightness(85%)';
    stainLabel = 'Transmission Electron Microscopy (TEM)';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] text-slate-200">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <Microscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Virtual Research Microscope Station
              </h3>
              <p className="text-[11px] text-slate-400">
                Slide: {currentSlide.name} • {objective}x Objective Lens ({objective * 10}x Total Magnification)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace: Left Microscope Viewport + Right Optical Turret Controls */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Microscope Circular Field-of-View Ocular Viewport */}
          <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden p-6 select-none">
            {/* Ocular Outer Mask */}
            <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full overflow-hidden border-8 border-slate-900 shadow-[inset_0_0_80px_rgba(0,0,0,0.9),0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center bg-slate-900">
              {/* Simulated Specimen Tissue Canvas */}
              <div
                className="w-full h-full relative transition-all duration-300"
                style={{
                  filter: `blur(${blurAmount}px) ${filterCss}`,
                  opacity: lightIntensity / 100,
                  transform: `scale(${objective === 4 ? 0.6 : objective === 10 ? 1.0 : objective === 40 ? 1.8 : 2.8})`,
                }}
              >
                {/* Visual tissue pattern background */}
                <div
                  className="w-full h-full flex flex-wrap items-center justify-center gap-4 p-8"
                  style={{
                    backgroundColor: currentSlide.accentColor + '20',
                    backgroundImage: `radial-gradient(${currentSlide.accentColor}50 15%, transparent 20%), radial-gradient(${currentSlide.accentSecondary}40 15%, transparent 20%)`,
                    backgroundSize: '60px 60px',
                    backgroundPosition: '0 0, 30px 30px',
                  }}
                >
                  {/* Procedural cellular bodies */}
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-20 rounded-full border-2 border-slate-300/40 relative flex items-center justify-center"
                      style={{
                        backgroundColor: currentSlide.accentColor + '30',
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-400/40 flex items-center justify-center text-[8px] text-white font-mono">
                        N
                      </div>
                      {/* Sub-cellular dots */}
                      <span className="absolute top-2 left-3 w-2 h-2 rounded-full bg-emerald-400/80" />
                      <span className="absolute bottom-3 right-3 w-3 h-1.5 rounded-full bg-amber-400/80" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Eyepiece Reticle Grid Overlay */}
              {showReticle && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-px bg-teal-400/30" />
                  <div className="h-full w-px bg-teal-400/30 absolute" />
                  <div className="w-36 h-36 rounded-full border border-teal-400/20 absolute" />
                  <div className="w-72 h-72 rounded-full border border-teal-400/10 absolute" />
                </div>
              )}

              {/* Realistic Vignette Shadow Edge */}
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_90px_rgba(0,0,0,0.95)] pointer-events-none" />

              {/* Scale bar overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
                <div className="w-20 h-1 bg-white shadow-md" />
                <span className="text-[10px] font-mono text-white mt-1 drop-shadow-md">
                  {scaleBarMicrons} µm
                </span>
              </div>
            </div>

            {/* Viewport Info Tags */}
            <div className="absolute top-4 left-4 text-xs font-mono text-slate-400 space-y-0.5">
              <p className="text-teal-400 font-bold">{stainLabel}</p>
              <p>Objective: {objective}x DIN Achromat</p>
              <p>Ocular: 10x Widefield</p>
            </div>
          </div>

          {/* Right Turret Controls & Slide Rack */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900/90 p-4 space-y-4 overflow-y-auto no-scrollbar">
            {/* Prepared Slide Rack */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Slide Tray Carousel
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {CELL_SPECIMENS.map((cell) => (
                  <button
                    key={cell.id}
                    type="button"
                    onClick={() => {
                      setActiveSlideId(cell.id);
                      onSelectCell(cell.id);
                    }}
                    className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                      activeSlideId === cell.id
                        ? 'bg-teal-950/60 border-teal-500 text-teal-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="truncate block">{cell.name}</span>
                    <span className="text-[10px] text-slate-500 font-normal truncate block">
                      {cell.scientificName}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Revolving Objective Turret */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Revolving Nosepiece Objective
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {([4, 10, 40, 100] as const).map((mag) => (
                  <button
                    key={mag}
                    type="button"
                    onClick={() => setObjective(mag)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      objective === mag
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mag}x
                  </button>
                ))}
              </div>
            </div>

            {/* Staining / Contrast Modes */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Optical Contrast Mode
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {(
                  [
                    ['brightfield', 'Brightfield'],
                    ['phase_contrast', 'Phase Contrast'],
                    ['fluorescence', 'Fluorescence'],
                    ['electron_tem', 'TEM Grayscale'],
                  ] as const
                ).map(([modeKey, label]) => (
                  <button
                    key={modeKey}
                    type="button"
                    onClick={() => setStainMode(modeKey as StainingTechnique)}
                    className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
                      stainMode === modeKey
                        ? 'bg-teal-600/30 border-teal-500 text-teal-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fine / Coarse Focus Knob */}
            <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Focus className="w-3.5 h-3.5 text-teal-400" />
                  <span>Focal Plane Adjustment</span>
                </span>
                <button
                  type="button"
                  onClick={() => setFocusOffset(0)}
                  className="text-[10px] font-mono text-teal-400 hover:underline"
                >
                  Autofocus (0)
                </button>
              </div>

              <input
                type="range"
                min={-10}
                max={10}
                step={0.5}
                value={focusOffset}
                onChange={(e) => setFocusOffset(parseFloat(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Coarse Near</span>
                <span className={focusOffset === 0 ? 'text-emerald-400 font-bold' : ''}>
                  {focusOffset === 0 ? 'Optimal Sharp Focus' : `${focusOffset > 0 ? '+' : ''}${focusOffset}`}
                </span>
                <span>Coarse Far</span>
              </div>
            </div>

            {/* Substage Illuminator & Reticle */}
            <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Substage LED Lamp</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">{lightIntensity}%</span>
              </div>

              <input
                type="range"
                min={20}
                max={100}
                value={lightIntensity}
                onChange={(e) => setLightIntensity(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Ocular Reticle Grid</span>
                <button
                  type="button"
                  onClick={() => setShowReticle((prev) => !prev)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    showReticle ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {showReticle ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
