import React, { useState, useRef } from 'react';
import { Detection } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  Sliders,
  Eye,
  EyeOff,
  Compass,
  Layers,
  MapPin,
  ShieldAlert,
  Ruler,
  Download,
  Info,
  ChevronRight,
  Sparkles,
  Volume2,
  Ship,
  Boxes,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '../common/Toast';

export interface ShipwreckDebrisViewerProps {
  shipwreckDetection?: Detection | null;
  onOpenOnMap?: (detection: Detection) => void;
  onOpenValidation?: (detection: Detection) => void;
  onClose?: () => void;
  isModal?: boolean;
}

type PaletteMode = 'cyan' | 'amber' | 'grayscale' | 'viridis' | 'copper';

interface DebrisZone {
  id: string;
  name: string;
  category: 'Keel/Hull' | 'Superstructure' | 'Debris Scatter' | 'Hazard' | 'Cargo';
  x: number; // percentage
  y: number; // percentage
  width: number;
  height: number;
  dimensions: string;
  reliefHeight: number;
  snrDb: number;
  hazardLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  description: string;
  salvagePriority: string;
}

const DEBRIS_ZONES: DebrisZone[] = [
  {
    id: 'zone-hull',
    name: 'Main Vessel Keel & Hull Girder',
    category: 'Keel/Hull',
    x: 48,
    y: 50,
    width: 32,
    height: 18,
    dimensions: '68.4m × 14.2m',
    reliefHeight: 6.8,
    snrDb: 27.5,
    hazardLevel: 'CRITICAL',
    description: 'Continuous structural steel hull resting at 12° starboard list. Hull integrity compromised at cargo hold #2.',
    salvagePriority: 'Immediate Notice to Mariners (NOTMAR) required'
  },
  {
    id: 'zone-bow',
    name: 'Bow Section & Collision Crumple',
    category: 'Keel/Hull',
    x: 74,
    y: 46,
    width: 14,
    height: 14,
    dimensions: '18.2m × 9.5m',
    reliefHeight: 5.2,
    snrDb: 24.8,
    hazardLevel: 'HIGH',
    description: 'Bulbous bow buried 2.4m into benthic silt with anchor flukes protruding upward.',
    salvagePriority: 'Potential anchor chain snag hazard for bottom trawlers'
  },
  {
    id: 'zone-bridge',
    name: 'Superstructure & Wheelhouse Tower',
    category: 'Superstructure',
    x: 36,
    y: 44,
    width: 12,
    height: 14,
    dimensions: '14.0m × 11.0m',
    reliefHeight: 6.8,
    snrDb: 28.2,
    hazardLevel: 'CRITICAL',
    description: 'Highest vertical acoustic obstacle above seabed. Radar mast sheared off and lying 6m south-west.',
    salvagePriority: 'Minimum clearance 28.4m CD (Chart Datum) warning'
  },
  {
    id: 'zone-cargo',
    name: 'Spilled Intermodal Containers (Field Alpha)',
    category: 'Cargo',
    x: 42,
    y: 70,
    width: 22,
    height: 16,
    dimensions: '38.0m × 18.5m',
    reliefHeight: 2.8,
    snrDb: 22.0,
    hazardLevel: 'HIGH',
    description: 'Cluster of 8 standard 40ft containers displaced during sinking; 3 ruptured with industrial contents.',
    salvagePriority: 'Environmental hazard assessment required'
  },
  {
    id: 'zone-stern',
    name: 'Stern, Rudder & Twin Propellers',
    category: 'Hazard',
    x: 22,
    y: 54,
    width: 14,
    height: 15,
    dimensions: '16.5m × 10.2m',
    reliefHeight: 4.6,
    snrDb: 25.1,
    hazardLevel: 'HIGH',
    description: 'Cast bronze propeller blades entangled with ~450m of nylon monofilament ghost driftnet.',
    salvagePriority: 'Severe marine fauna entanglement zone'
  },
  {
    id: 'zone-debris-field',
    name: 'Peripheral Hull Plating & Pipe Scatter',
    category: 'Debris Scatter',
    x: 58,
    y: 26,
    width: 24,
    height: 16,
    dimensions: '52.0m × 22.0m',
    reliefHeight: 1.4,
    snrDb: 18.4,
    hazardLevel: 'MODERATE',
    description: 'Dispersed fragmented deck plates, ventilation funnels, and boom machinery fragments.',
    salvagePriority: 'Periodic sonar monitoring for sediment scour movement'
  }
];

export function ShipwreckDebrisViewer({
  shipwreckDetection,
  onOpenOnMap,
  onOpenValidation,
  onClose,
  isModal = false
}: ShipwreckDebrisViewerProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [palette, setPalette] = useState<PaletteMode>('cyan');
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [showShadows, setShowShadows] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showHazardRadius, setShowHazardRadius] = useState<boolean>(true);
  const [activeZone, setActiveZone] = useState<DebrisZone>(DEBRIS_ZONES[0]);
  const [measuringMode, setMeasuringMode] = useState<boolean>(false);
  const [measuredDistance, setMeasuredDistance] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const getPaletteFilter = () => {
    switch (palette) {
      case 'cyan':
        return 'hue-rotate(150deg) saturate(180%) contrast(135%) brightness(105%)';
      case 'amber':
        return 'hue-rotate(0deg) saturate(160%) contrast(140%) brightness(110%)';
      case 'grayscale':
        return 'grayscale(100%) contrast(150%) brightness(95%)';
      case 'viridis':
        return 'hue-rotate(240deg) saturate(230%) contrast(130%) brightness(100%)';
      case 'copper':
        return 'sepia(100%) hue-rotate(330deg) saturate(200%) contrast(135%)';
      default:
        return 'none';
    }
  };

  const handleExportDossier = () => {
    const report = {
      title: 'BUFFERS Acoustic Target Dossier - Sunken Vessel & Debris Field',
      targetCode: shipwreckDetection?.targetCode || 'TGT-005',
      vesselIdentification: 'MV Sagarika (Bulk Freighter, ~70m)',
      coordinates: [18.4590, 72.8180],
      waterDepthMeters: 35.2,
      maxReliefObstacleMeters: 6.8,
      hazardPerimeterMeters: 120,
      debrisZones: DEBRIS_ZONES,
      classificationConfidence: 0.98,
      generatedAt: new Date().toISOString()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `SHIPWRECK_DEBRIS_${shipwreckDetection?.targetCode || 'TGT-005'}_DOSSIER.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Export Completed', 'Full acoustic debris dossier downloaded successfully', 'success');
  };

  return (
    <div className={`flex flex-col gap-4 ${isModal ? 'p-2' : ''}`}>
      {/* Top Banner Ribbon */}
      <div className="bg-[#040817] border border-cyan-500/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-cyan-950/40">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
            <Ship className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-cyan-300">
                {shipwreckDetection?.targetCode || 'TGT-005'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/50 font-bold uppercase tracking-wider">
                CRITICAL HAZARD
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                WHOLE SHIP DEBRIS FIELD
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                AI CONFIDENCE 98.4%
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-white mt-1">
              Sunken Vessel Structural Hull & Marine Debris Field Reconstruction
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Position: 18.4590°N, 72.8180°E</span>
              <span>•</span>
              <span>Water Depth: 35.2m</span>
              <span>•</span>
              <span>Max Relief: 6.8m Above Bed</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">Min Nav Clearance: 28.4m</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {onOpenOnMap && shipwreckDetection && (
            <button
              onClick={() => onOpenOnMap(shipwreckDetection)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>View On Map</span>
            </button>
          )}

          {onOpenValidation && shipwreckDetection && (
            <button
              onClick={() => onOpenValidation(shipwreckDetection)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-600/50 text-xs font-mono transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Validate Target</span>
            </button>
          )}

          <button
            onClick={handleExportDossier}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* Control Ribbon: Palettes, Layers, Calipers & Zoom */}
      <div className="bg-[#040817] border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Palette Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 px-1 uppercase">Acoustic Palette:</span>
            {(['cyan', 'amber', 'grayscale', 'viridis', 'copper'] as PaletteMode[]).map((p) => (
              <button
                key={p}
                onClick={() => setPalette(p)}
                className={`px-2 py-0.5 rounded text-[11px] uppercase transition-colors cursor-pointer ${
                  palette === p
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Toggle Layers */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              showOverlays
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            {showOverlays ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3" />}
            <span>Debris Hotspots</span>
          </button>

          <button
            onClick={() => setShowShadows(!showShadows)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              showShadows
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Acoustic Shadows</span>
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              showGrid
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>50m Scale Grid</span>
          </button>

          <button
            onClick={() => setShowHazardRadius(!showHazardRadius)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              showHazardRadius
                ? 'bg-rose-950/70 text-rose-300 border-rose-500/40 font-semibold'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>120m Hazard Buffer</span>
          </button>

          <button
            onClick={() => {
              setMeasuringMode(!measuringMode);
              if (!measuringMode) {
                setMeasuredDistance('68.4 meters (Ship Hull Keel Length)');
              } else {
                setMeasuredDistance(null);
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              measuringMode
                ? 'bg-amber-950 text-amber-300 border-amber-500/50 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Ruler className="w-3 h-3 text-amber-400" />
            <span>Acoustic Caliper</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-slate-300">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] px-2 tabular-nums font-bold text-cyan-400">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Visualizer: High-Res Whole Ship Image Canvas (Left 8 cols) + Hydrographic Profile (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Stage: High-Resolution Whole Shipwreck Debris Sonar */}
        <div className="lg:col-span-8 bg-[#040817] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          {/* Top Swath / Acoustic Meta Strip */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
            <span className="text-cyan-400 font-semibold">PORT ACOUSTIC CHANNEL (FREQ: 455 kHz)</span>
            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
              HIGH-RESOLUTION ORTHO-MOSAIC
            </span>
            <span className="text-amber-400 font-semibold">DEBRIS DISPERSION: 185m × 94m</span>
          </div>

          {/* Interactive Image Container */}
          <div className="relative w-full h-[520px] bg-black rounded-xl border border-cyan-500/30 overflow-hidden select-none flex items-center justify-center">
            {/* The High-Resolution Whole Ship Sonar Image */}
            <div
              className="relative w-full h-full transition-transform duration-200 origin-center flex items-center justify-center cursor-crosshair"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src="/src/assets/images/whole_ship_debris_1790597646950.jpg"
                alt="Whole Sunken Vessel and Debris Field Sonar Imagery"
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
                style={{ filter: getPaletteFilter() }}
              />

              {/* Optional 50m Scale Grid */}
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-25"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(6, 182, 212, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.4) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}
                />
              )}

              {/* 120m Navigational Hazard Perimeter Circle */}
              {showHazardRadius && (
                <div className="absolute w-[80%] h-[75%] rounded-full border-2 border-dashed border-rose-500/60 pointer-events-none animate-pulse flex items-center justify-center">
                  <span className="absolute -top-3 bg-rose-950/90 text-rose-300 border border-rose-600/70 text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    ⚠ 120m Navigational Hazard Clearance Boundary
                  </span>
                </div>
              )}

              {/* Acoustic Shadow Lines / Vectors */}
              {showShadows && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Shadow vector extending from hull to the upper-left */}
                  <svg className="w-full h-full absolute inset-0">
                    <defs>
                      <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Shadow projection polygon from main hull */}
                    <polygon
                      points="320,260 480,240 430,170 290,190"
                      fill="rgba(0,0,0,0.55)"
                      stroke="rgba(6,182,212,0.4)"
                      strokeDasharray="4 2"
                    />
                    {/* Vector line */}
                    <line
                      x1="400"
                      y1="250"
                      x2="360"
                      y2="180"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <text x="310" y="165" fill="#67e8f9" fontSize="10" fontFamily="monospace">
                      Ls: 22.4m (Relief ~6.8m)
                    </text>
                  </svg>
                </div>
              )}

              {/* Hotspots: Interactive Zones on the Ship and Debris */}
              {showOverlays &&
                DEBRIS_ZONES.map((zone) => {
                  const isSelected = activeZone.id === zone.id;

                  return (
                    <div
                      key={zone.id}
                      onClick={() => setActiveZone(zone)}
                      style={{
                        top: `${zone.y}%`,
                        left: `${zone.x}%`,
                        width: `${zone.width}%`,
                        height: `${zone.height}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      className={`absolute rounded-xl transition-all cursor-pointer group flex flex-col justify-between p-2 ${
                        isSelected
                          ? 'border-2 border-cyan-400 bg-cyan-400/25 ring-4 ring-cyan-400/40 z-30'
                          : zone.hazardLevel === 'CRITICAL'
                          ? 'border-2 border-rose-500 bg-rose-500/15 hover:bg-rose-500/30 z-20'
                          : zone.hazardLevel === 'HIGH'
                          ? 'border-2 border-amber-400 bg-amber-400/15 hover:bg-amber-400/30 z-20'
                          : 'border border-cyan-500/60 bg-cyan-950/20 hover:bg-cyan-900/30 z-10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            isSelected
                              ? 'bg-cyan-950 text-cyan-200 border border-cyan-400'
                              : 'bg-black/85 text-white'
                          }`}
                        >
                          {zone.category}
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-black/85 text-cyan-300 px-1 py-0.5 rounded">
                          ▲ {zone.reliefHeight}m
                        </span>
                      </div>

                      <div className="text-[10px] font-mono font-bold text-white bg-black/85 px-1.5 py-0.5 rounded truncate shadow">
                        {zone.name}
                      </div>

                      <div className="text-[8px] font-mono text-slate-300 bg-black/75 px-1 rounded flex justify-between">
                        <span>{zone.dimensions}</span>
                        <span>{zone.snrDb} dB</span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Caliper measurement reading HUD */}
            {measuredDistance && (
              <div className="absolute top-4 left-4 bg-slate-950/95 border border-amber-500/60 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-mono shadow-xl flex items-center gap-2">
                <Ruler className="w-4 h-4 text-amber-400" />
                <span>Acoustic Caliper Measured: <strong>{measuredDistance}</strong></span>
              </div>
            )}

            {/* Canvas Bottom Realtime HUD */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-950/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-semibold">TOWFISH NADIR: 32m</span>
                <span>ALTITUDE: 8.5m</span>
                <span>PING RATE: 24 Hz</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">RESOLUTION: 0.05m / px</span>
                <span className="text-emerald-400">ACOUSTIC SNR: 27.5 dB</span>
              </div>
            </div>
          </div>

          {/* Seabed Relief Elevation Profile Strip */}
          <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2">
              <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Seabed Relief Cross-Section (Stern to Bow - 70m Profile)
              </span>
              <span className="text-amber-400">Max Peak: 6.8m at Bridge</span>
            </div>

            {/* Visual Relief Profile Bar */}
            <div className="h-8 bg-slate-900 rounded-lg p-1 flex items-end gap-1 border border-slate-800">
              {[1.2, 1.8, 2.5, 3.8, 4.6, 6.8, 6.2, 5.8, 4.2, 3.5, 2.9, 1.4, 0.8, 0.4].map(
                (height, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-cyan-900 to-cyan-400 rounded-xs hover:to-amber-400 transition-colors cursor-pointer group relative"
                    style={{ height: `${(height / 7) * 100}%` }}
                    title={`Distance ~${idx * 5}m: Relief ${height}m`}
                  >
                    <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-[9px] px-1 py-0.5 rounded text-white whitespace-nowrap z-30">
                      {height}m
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 mt-1">
              <span>0m (Stern Rudder)</span>
              <span>35m (Superstructure)</span>
              <span>70m (Bow Nose)</span>
            </div>
          </div>
        </div>

        {/* Right Stage: Detailed Subsea Target Telemetry & Debris Assessment */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Zone Detail Card */}
          <div className="bg-[#040817] border border-cyan-500/40 rounded-xl p-5 space-y-4 font-mono shadow-lg shadow-cyan-950/20">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase tracking-wider">
                  {activeZone.category}
                </span>
                <h3 className="text-base font-sans font-bold text-white mt-1.5 leading-snug">
                  {activeZone.name}
                </h3>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                  activeZone.hazardLevel === 'CRITICAL'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
                    : activeZone.hazardLevel === 'HIGH'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                }`}
              >
                {activeZone.hazardLevel}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">DIMENSIONS</span>
                <span className="text-slate-100 font-bold tabular-nums text-sm">
                  {activeZone.dimensions}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">RELIEF ABOVE BED</span>
                <span className="text-cyan-400 font-bold tabular-nums text-sm">
                  {activeZone.reliefHeight} meters
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ACOUSTIC SNR</span>
                <span className="text-amber-400 font-bold tabular-nums text-sm">
                  {activeZone.snrDb} dB
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">WATER DEPTH</span>
                <span className="text-slate-100 font-bold tabular-nums text-sm">
                  35.2 meters
                </span>
              </div>
            </div>

            {/* Description & Scientific Evidence */}
            <div className="p-3.5 bg-slate-950/90 rounded-lg border border-slate-800 font-sans text-xs space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                Acoustic Characterization & State:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {activeZone.description}
              </p>
            </div>

            {/* Salvage & Clearance Priority */}
            <div className="p-3.5 bg-rose-950/30 border border-rose-800/60 rounded-lg font-sans text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Maritime Hazard & Mitigation:</span>
              </div>
              <p className="text-rose-200/90 leading-relaxed font-mono text-[11px]">
                {activeZone.salvagePriority}
              </p>
            </div>
          </div>

          {/* Quick Zone Navigation List */}
          <div className="bg-[#040817] border border-slate-800/80 rounded-xl p-4 space-y-2 font-mono">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Debris Field Sub-Structures ({DEBRIS_ZONES.length})
            </span>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {DEBRIS_ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setActiveZone(zone)}
                  className={`w-full text-left p-2 rounded-lg border transition-colors flex items-center justify-between text-xs cursor-pointer ${
                    activeZone.id === zone.id
                      ? 'bg-cyan-950 text-cyan-200 border-cyan-500/50 font-bold'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="truncate">{zone.name}</span>
                  <span className="text-[10px] text-cyan-400 shrink-0 ml-2">
                    {zone.reliefHeight}m
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
