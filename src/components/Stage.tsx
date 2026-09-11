import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  Camera,
  Maximize2,
  Minimize2,
  Slice,
  Eye,
  EyeOff,
  Crosshair,
  Sliders,
  Download,
  Layers,
  Sparkles,
  Tag,
  CircleDot,
} from 'lucide-react';
import {
  CellItem,
  MaterialMode,
  ViewMode,
  ZoomPreset,
  ScreenshotQuality,
  CellCyclePhase,
} from '../types';
import { CellScene } from './CellScene';
import { captureCanvasScreenshot, triggerDownload } from '../lib/download';

interface StageProps {
  cell: CellItem;
  selectedOrganelleId: string;
  onSelectOrganelle: (id: string) => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  materialMode: MaterialMode;
  onChangeMaterialMode: (mode: MaterialMode) => void;
  crossSection: boolean;
  onToggleCrossSection: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  hiddenOrganelleIds: string[];
  onIsolateOrganelle: (id: string) => void;
  onResetView: () => void;
  onOpenModal: (type: 'comparison') => void;
}

export const Stage: React.FC<StageProps> = ({
  cell,
  selectedOrganelleId,
  onSelectOrganelle,
  viewMode,
  onToggleViewMode,
  materialMode,
  onChangeMaterialMode,
  crossSection,
  onToggleCrossSection,
  autoRotate,
  onToggleAutoRotate,
  hiddenOrganelleIds,
  onIsolateOrganelle,
  onResetView,
  onOpenModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomPreset, setZoomPreset] = useState<ZoomPreset>('1x');
  const [screenshotQuality, setScreenshotQuality] = useState<ScreenshotQuality>('web');
  const [showScreenshotMenu, setShowScreenshotMenu] = useState(false);
  const [showCallouts, setShowCallouts] = useState(true);

  // Time-lapse / Cell Cycle Mitosis state
  const [timeLapseActive, setTimeLapseActive] = useState(false);
  const [cyclePhase, setCyclePhase] = useState<CellCyclePhase>('interphase');

  const phases: CellCyclePhase[] = ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase'];

  useEffect(() => {
    if (!timeLapseActive) return;

    const timer = setInterval(() => {
      setCyclePhase((prev) => {
        const idx = phases.indexOf(prev);
        const nextIdx = (idx + 1) % phases.length;
        return phases[nextIdx];
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [timeLapseActive]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleCapture = (quality: ScreenshotQuality) => {
    captureCanvasScreenshot(
      canvasRef.current,
      `${cell.id}-${selectedOrganelleId}-${quality}-render.png`,
      quality
    );
    setShowScreenshotMenu(false);
  };

  const handleExportGlb = () => {
    // Generate sample GLB / JSON descriptor
    const exportData = {
      specimen: cell.name,
      scientificName: cell.scientificName,
      organelles: cell.organelles,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${cell.id}-3d-architecture-manifest.json`);
  };

  return (
    <section
      ref={containerRef}
      id="3d-stage-viewport"
      className="flex-1 relative h-full flex flex-col bg-slate-950 overflow-hidden select-none"
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none gap-2">
        {/* Left: View Mode (Mesh / Focus) & Cross-Section */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 pointer-events-auto shadow-lg">
          <button
            type="button"
            onClick={onToggleViewMode}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'focus'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{viewMode === 'focus' ? 'Focus View' : 'Mesh View'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleCrossSection}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              crossSection
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Slice model with real-time clipping plane"
          >
            <Slice className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cross Section</span>
          </button>

          {/* Material Mode Selector */}
          <div className="hidden md:flex items-center border-l border-slate-800 pl-1.5 gap-1">
            {(['native', 'studio', 'solid'] as MaterialMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onChangeMaterialMode(mode)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors ${
                  materialMode === mode
                    ? 'bg-slate-800 text-teal-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Compare button & Callouts toggle */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Compare cell button */}
          <button
            type="button"
            onClick={() => onOpenModal('comparison')}
            className="px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 text-xs font-semibold backdrop-blur-md border border-slate-800 shadow-lg flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Compare vs {cell.comparisonCellId}</span>
            <span className="sm:hidden">Compare</span>
          </button>

          {/* Labels Toggle */}
          <button
            type="button"
            onClick={() => setShowCallouts((prev) => !prev)}
            className={`p-1.5 rounded-xl border backdrop-blur-md transition-colors shadow-lg ${
              showCallouts
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={showCallouts ? 'Hide 3D organelle labels' : 'Show 3D organelle labels'}
          >
            <Tag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Three.js Scene */}
      <div className="flex-1 w-full h-full relative">
        <CellScene
          cell={cell}
          selectedOrganelleId={selectedOrganelleId}
          onSelectOrganelle={onSelectOrganelle}
          viewMode={viewMode}
          materialMode={materialMode}
          crossSection={crossSection}
          autoRotate={autoRotate}
          zoomPreset={zoomPreset}
          timeLapseActive={timeLapseActive}
          cyclePhase={cyclePhase}
          hiddenOrganelleIds={hiddenOrganelleIds}
          showCalloutLabels={showCallouts}
          onCanvasReady={(c) => {
            canvasRef.current = c;
          }}
        />

        {/* Time-lapse Mitosis Phase Overlay Badge */}
        {timeLapseActive && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/50 backdrop-blur-md shadow-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Mitosis Phase: {cyclePhase}
            </span>
            <span className="text-[10px] text-slate-400">
              ({phases.indexOf(cyclePhase) + 1}/{phases.length})
            </span>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none gap-2">
        {/* Left: Zoom Presets (1x / 10x / 40x / 100x) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 pointer-events-auto shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 px-1.5 uppercase tracking-wider">
            Mag:
          </span>
          {(['1x', '10x', '40x', '100x'] as ZoomPreset[]).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setZoomPreset(preset)}
              className={`px-2 py-0.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                zoomPreset === preset
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Center: Time-Lapse Mitosis Play/Pause */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setTimeLapseActive((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              timeLapseActive
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-500/25 animate-pulse'
                : 'bg-slate-900/85 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {timeLapseActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-indigo-400" />}
            <span className="hidden sm:inline">{timeLapseActive ? 'Pause Cycle' : 'Mitosis Cycle'}</span>
          </button>
        </div>

        {/* Right: Stage Action Toolbar */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 pointer-events-auto shadow-lg">
          {/* Auto Rotate */}
          <button
            type="button"
            onClick={onToggleAutoRotate}
            className={`p-1.5 rounded-lg transition-colors ${
              autoRotate ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Auto Rotation (R)"
          >
            <CircleDot className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          {/* Isolate Active Organelle */}
          <button
            type="button"
            onClick={() => onIsolateOrganelle(selectedOrganelleId)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Isolate current organelle"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Reset View */}
          <button
            type="button"
            onClick={onResetView}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset camera view (0)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Screenshot Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowScreenshotMenu((prev) => !prev)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Capture render screenshot"
            >
              <Camera className="w-4 h-4" />
            </button>

            {showScreenshotMenu && (
              <div className="absolute right-0 bottom-9 w-40 py-1 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 text-xs">
                <div className="px-3 py-1 font-semibold text-slate-400 text-[10px] uppercase">
                  Screenshot Quality
                </div>
                <button
                  type="button"
                  onClick={() => handleCapture('web')}
                  className="w-full px-3 py-1 text-left hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>Web Standard</span>
                  <span className="font-mono text-slate-400 text-[10px]">1x</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCapture('print')}
                  className="w-full px-3 py-1 text-left hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>Print Quality</span>
                  <span className="font-mono text-slate-400 text-[10px]">2x</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCapture('ultra')}
                  className="w-full px-3 py-1 text-left hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>Ultra 4K</span>
                  <span className="font-mono text-slate-400 text-[10px]">4x</span>
                </button>
              </div>
            )}
          </div>

          {/* Export Manifest */}
          <button
            type="button"
            onClick={handleExportGlb}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Export 3D cell data manifest"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
};
