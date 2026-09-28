import React, { useState } from 'react';
import { Detection, DetectionType } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  Sliders,
  Eye,
  EyeOff,
  Calculator,
  ChevronRight,
  Sparkles,
  Ship
} from 'lucide-react';
import { useToast } from '../common/Toast';

export interface SonarAnalysisPageProps {
  detections: Detection[];
  selectedDetection: Detection | null;
  onSelectDetection: (detection: Detection) => void;
  onOpenDetailsDrawer: (detection: Detection) => void;
  onOpenShipwreckDebris?: (detection: Detection) => void;
}

type ColorMap = 'amber' | 'cyan' | 'grayscale' | 'viridis';

export function SonarAnalysisPage({
  detections,
  selectedDetection,
  onSelectDetection,
  onOpenDetailsDrawer,
  onOpenShipwreckDebris
}: SonarAnalysisPageProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [colorMap, setColorMap] = useState<ColorMap>('cyan');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [showShadowLabels, setShowShadowLabels] = useState<boolean>(true);
  const [calcAltitude, setCalcAltitude] = useState<number>(8.5);
  const [calcShadowLength, setCalcShadowLength] = useState<number>(8.2);
  const [calcSlantRange, setCalcSlantRange] = useState<number>(38.2);
  const { showToast } = useToast();

  const activeTarget = selectedDetection || detections[0];

  // Acoustic Shadow Object Height Formula: H = (Altitude * ShadowLength) / SlantRange
  const calculatedHeight = ((calcAltitude * calcShadowLength) / (calcSlantRange || 1)).toFixed(2);

  const getColorFilter = () => {
    switch (colorMap) {
      case 'cyan':
        return 'hue-rotate(140deg) saturate(180%) contrast(130%)';
      case 'grayscale':
        return 'grayscale(100%) contrast(140%) brightness(90%)';
      case 'viridis':
        return 'hue-rotate(240deg) saturate(220%) contrast(125%)';
      case 'amber':
      default:
        return 'contrast(125%) brightness(105%)';
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="space-y-4">
      {/* Top Header & Toolset Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#040817] border border-slate-800/80 rounded-xl p-4">
        <div>
          <h1 className="font-mono text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-cyan-400" />
            Side-Scan Sonar Acoustic Waterfall Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime dual-frequency side-scan acoustic stream with automated deep learning shadow & backscatter inference
          </p>
        </div>

        {/* Sonar Control Ribbon */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Colormap Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 px-1 text-[10px] uppercase">Palette:</span>
            {(['cyan', 'amber', 'grayscale', 'viridis'] as ColorMap[]).map((c) => (
              <button
                key={c}
                onClick={() => setColorMap(c)}
                className={`px-2 py-0.5 rounded text-[11px] uppercase transition-colors cursor-pointer ${
                  colorMap === c
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Whole Ship Debris View Button */}
          {onOpenShipwreckDebris && (
            <button
              onClick={() => {
                const shipwreckTarget =
                  detections.find((d) => d.isShipwreckDebris || d.type === 'Shipwreck Section') ||
                  detections[0];
                onOpenShipwreckDebris(shipwreckTarget);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950 via-cyan-900 to-slate-900 text-cyan-300 border border-cyan-400/60 text-xs font-mono font-bold transition-all shadow-md shadow-cyan-950/50 hover:border-cyan-400 cursor-pointer"
            >
              <Ship className="w-3.5 h-3.5 text-cyan-400" />
              <span>Whole Ship Debris Scanner</span>
            </button>
          )}

          {/* Toggle Bounding Boxes */}
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              showBoundingBoxes
                ? 'bg-slate-800 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            {showBoundingBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>AI Boxes</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-slate-300">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 tabular-nums text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 ml-0.5 cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace: Waterfall Stage (Left 8 cols) + Acoustic Inspector (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sonar Waterfall Stage */}
        <div className="lg:col-span-8 bg-[#040817] border border-slate-800/80 rounded-xl p-4 flex flex-col">
          {/* Swath Labels */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 px-1">
            <span className="text-cyan-400 font-semibold">◄ PORT SWATH (-75m)</span>
            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
              CENTRAL WATER COLUMN (NADIR)
            </span>
            <span className="text-cyan-400 font-semibold">STARBOARD SWATH (+75m) ►</span>
          </div>

          {/* Waterfall Viewer Container */}
          <div className="relative flex-1 min-h-[500px] max-h-[640px] bg-black rounded-xl border border-slate-800/80 overflow-hidden select-none">
            <div
              className="w-full h-full relative transition-transform duration-200 origin-center flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src="/src/assets/images/sonar_waterfall_scan_1790596329548.jpg"
                alt="Sonar waterfall stream"
                className="w-full h-full object-cover pointer-events-none"
                style={{ filter: getColorFilter() }}
              />

              {/* Nadir Center Guide */}
              <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-black/60 border-x border-cyan-500/30 flex items-center justify-center pointer-events-none">
                <div className="w-0.5 h-full bg-cyan-400/40" />
              </div>

              {/* AI Detection Bounding Boxes Overlay */}
              {showBoundingBoxes &&
                detections.slice(0, 4).map((detection, idx) => {
                  const isSelected = activeTarget?.id === detection.id;
                  const positions = [
                    { top: '30%', left: '22%', width: '22%', height: '24%' },
                    { top: '48%', left: '60%', width: '18%', height: '20%' },
                    { top: '65%', left: '26%', width: '24%', height: '18%' },
                    { top: '18%', left: '64%', width: '20%', height: '22%' }
                  ];
                  const pos = positions[idx % positions.length];

                  return (
                    <div
                      key={detection.id}
                      onClick={() => onSelectDetection(detection)}
                      style={{
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        height: pos.height
                      }}
                      className={`absolute rounded-lg border-2 transition-all cursor-pointer group flex flex-col justify-between p-1.5 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-400/25 ring-2 ring-cyan-400/50 z-20'
                          : detection.priority === 'High Priority'
                          ? 'border-rose-500 bg-rose-500/15 hover:bg-rose-500/25 z-10'
                          : 'border-amber-400 bg-amber-400/15 hover:bg-amber-400/25 z-10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                            isSelected
                              ? 'bg-cyan-950 text-cyan-200 border border-cyan-400'
                              : 'bg-black/80 text-white'
                          }`}
                        >
                          {detection.targetCode}
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-black/80 text-emerald-400 px-1 py-0.2 rounded">
                          {(detection.confidence * 100).toFixed(0)}%
                        </span>
                      </div>

                      <div className="text-[9px] font-mono text-white bg-black/80 px-1 py-0.5 rounded truncate">
                        {detection.name}
                      </div>

                      {showShadowLabels && (
                        <div className="absolute -bottom-5 left-0 text-[8px] font-mono text-cyan-300 bg-slate-950/90 border border-slate-700 px-1 py-0.2 rounded whitespace-nowrap">
                          Shadow: {detection.shadowLengthMeters}m · Relief: ~{detection.reliefAboveBedMeters}m
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* In-viewport HUD telemetry */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-950/90 backdrop-blur px-3.5 py-1.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-semibold">TOWFISH #4205</span>
                <span>ALT: 8.7m</span>
                <span>DEPTH: 28.6m</span>
              </div>
              <div className="flex items-center gap-3">
                <span>PING #12,480</span>
                <span>RANGE: 75m</span>
                <span className="text-emerald-400">BUFFER: 100% OK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Acoustic Target Inspector & Shadow Height Tool */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Contact Telemetry Card */}
          {activeTarget && (
            <div className="bg-[#040817] border border-slate-800/80 rounded-xl p-4 space-y-3 font-mono">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400">
                      {activeTarget.targetCode}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        activeTarget.priority === 'High Priority'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {activeTarget.priority}
                    </span>
                  </div>
                  <h3 className="text-sm font-sans font-bold text-white mt-1">
                    {activeTarget.name}
                  </h3>
                </div>

                <button
                  onClick={() => onOpenDetailsDrawer(activeTarget)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Target Hydrographic Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">DIMENSIONS</span>
                  <span className="text-slate-100 font-bold tabular-nums">
                    {activeTarget.dimensions.lengthMeters}m × {activeTarget.dimensions.widthMeters}m
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">EST. RELIEF</span>
                  <span className="text-cyan-400 font-bold tabular-nums">
                    {activeTarget.reliefAboveBedMeters} m
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">WATER DEPTH</span>
                  <span className="text-slate-100 font-bold tabular-nums">
                    {activeTarget.depthMeters} m
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">ACOUSTIC SNR</span>
                  <span className="text-amber-400 font-bold tabular-nums">
                    {activeTarget.snrDb} dB
                  </span>
                </div>
              </div>

              {/* Acoustic Image Snapshot Preview */}
              {(activeTarget.image || activeTarget.isShipwreckDebris || activeTarget.type === 'Shipwreck Section') && (
                <div className="relative rounded-lg overflow-hidden border border-cyan-500/40 bg-black group">
                  <img
                    src={
                      activeTarget.image ||
                      '/src/assets/images/whole_ship_debris_1790597646950.jpg'
                    }
                    alt={activeTarget.name}
                    className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end justify-between p-2">
                    <span className="text-[10px] text-cyan-300 font-bold bg-black/80 px-1.5 py-0.5 rounded">
                      Acoustic Backscatter
                    </span>
                    {onOpenShipwreckDebris && (
                      <button
                        onClick={() => onOpenShipwreckDebris(activeTarget)}
                        className="text-[10px] bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Ship className="w-3 h-3" />
                        <span>Whole Ship View</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Evidence Snippet */}
              <div className="pt-2 border-t border-slate-800 font-sans text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Acoustic Evidence:
                </span>
                <p className="text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                  {activeTarget.acousticEvidence}
                </p>
              </div>
            </div>
          )}

          {/* Shadow-to-Height Acoustic Tool */}
          <div className="bg-[#040817] border border-slate-800/80 rounded-xl p-4 space-y-3 font-mono">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Acoustic Shadow Height Calculator
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal font-sans">
              Calculates submerged obstacle relief height using towfish altitude and acoustic shadow geometry: <span className="font-mono text-cyan-300">H = (A × Ls) / Rs</span>
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Towfish Altitude (A in meters):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcAltitude}
                  onChange={(e) => setCalcAltitude(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-100 focus:outline-none focus:border-cyan-500 tabular-nums"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Acoustic Shadow Length (Ls in meters):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcShadowLength}
                  onChange={(e) => setCalcShadowLength(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-100 focus:outline-none focus:border-cyan-500 tabular-nums"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Slant Range to Target (Rs in meters):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcSlantRange}
                  onChange={(e) => setCalcSlantRange(parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-100 focus:outline-none focus:border-cyan-500 tabular-nums"
                />
              </div>

              <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-lg flex items-center justify-between mt-2">
                <span className="text-cyan-300 font-semibold text-xs">
                  Derived Target Height:
                </span>
                <span className="text-base font-bold text-white tabular-nums">
                  {calculatedHeight} m
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
