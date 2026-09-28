import React from 'react';
import { Mission, Detection, SystemStatus } from '../../types';
import { NavItem } from '../layouts/Sidebar';
import {
  Waves,
  Crosshair,
  ShieldAlert,
  Percent,
  Compass,
  CheckSquare,
  Cpu,
  Radio,
  Navigation,
  Map,
  MapPin,
  Clock,
  Ship,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export interface OverviewDashboardProps {
  mission: Mission;
  detections: Detection[];
  systemStatus: SystemStatus;
  onNavigateTab: (tab: NavItem) => void;
  onOpenShipwreckDebris?: () => void;
}

export function OverviewDashboard({
  mission,
  detections,
  systemStatus,
  onNavigateTab,
  onOpenShipwreckDebris
}: OverviewDashboardProps) {
  const shipwreckDetection = detections.find((d) => d.isShipwreckDebris || d.type === 'Shipwreck Section');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-2xl font-bold tracking-wide text-white">
              UNDERWATER INTELLIGENCE COMMAND CENTER
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              SIH26057
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            AI-powered side-scan sonar analysis and marine anomaly detection
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => onNavigateTab('shipwreck-debris')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-950 via-cyan-900 to-slate-900 hover:from-cyan-900 hover:to-cyan-800 text-cyan-200 border border-cyan-400/60 rounded-lg text-xs font-mono font-bold transition-all shadow-md shadow-cyan-950/60 cursor-pointer"
          >
            <Ship className="w-4 h-4 text-cyan-400" />
            <span>Whole Ship Debris Scanner</span>
          </button>
          <button
            onClick={() => onNavigateTab('sonar-analysis')}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/50 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>((•)) Live Waterfall</span>
          </button>
          <button
            onClick={() => onNavigateTab('priority-map')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Priority Map</span>
          </button>
        </div>
      </div>

      {/* Featured Headline Discovery: Whole Ship Debris Showcase */}
      <div className="bg-gradient-to-r from-[#040B22] via-[#040E2D] to-[#040817] border border-cyan-500/50 rounded-xl p-5 shadow-xl shadow-cyan-950/30 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex-1 space-y-3 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-400 font-bold uppercase tracking-wider">
              FLAGSHIP ACOUSTIC CONTACT
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/50 font-bold uppercase">
              CRITICAL NAVIGATION HAZARD
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Target Code: {shipwreckDetection?.targetCode || 'TGT-005'}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <Ship className="w-5 h-5 text-cyan-400" />
              Whole Sunken Vessel & Extensive Debris Field
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              High-resolution side-scan acoustic reconstruction reveals an intact 68.4m cargo freighter hull with a 185m × 94m surrounding debris scatter field, spilled intermodal containers, and 6.8m vertical relief above the seabed.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-300 flex-wrap pt-1">
            <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">HULL LENGTH</span>
              <span className="font-bold text-white">68.4 meters</span>
            </div>
            <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">MAX RELIEF HEIGHT</span>
              <span className="font-bold text-cyan-400">6.8m (Bridge Tower)</span>
            </div>
            <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">MIN CLEARANCE DEPTH</span>
              <span className="font-bold text-amber-400">28.4 meters</span>
            </div>
            <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">AI CONFIDENCE</span>
              <span className="font-bold text-emerald-400">98.4%</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('shipwreck-debris')}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold rounded-lg text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Ship className="w-4 h-4" />
              <span>Launch Whole Ship Debris Visualizer & 3D Reconstruction</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thumbnail Preview with acoustic highlight */}
        <div
          onClick={() => onNavigateTab('shipwreck-debris')}
          className="relative w-full lg:w-80 h-48 rounded-xl overflow-hidden border-2 border-cyan-500/60 shadow-2xl bg-black cursor-pointer group shrink-0"
        >
          <img
            src="/src/assets/images/whole_ship_debris_1790597646950.jpg"
            alt="Whole Shipwreck Debris Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
            <span className="text-[10px] font-mono font-bold text-white bg-black/80 px-2 py-0.5 rounded border border-slate-700">
              455 kHz Dual Swath
            </span>
            <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-500/60">
              Click to Expand 3D
            </span>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Sonar Frames Processed */}
        <div className="bg-[#040817] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold tracking-wider leading-tight">
              SONAR FRAMES PROCESSED
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-900/50 flex items-center justify-center text-cyan-400">
              <Waves className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
              12,480
            </div>
            <div className="text-[11px] font-mono text-emerald-400 font-semibold mt-1">
              +42/min Real-time
            </div>
          </div>
        </div>

        {/* Card 2: Objects Detected */}
        <div className="bg-[#040817] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold tracking-wider leading-tight">
              OBJECTS DETECTED
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-900/50 flex items-center justify-center text-cyan-400">
              <Crosshair className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
              327
            </div>
            <div className="text-[11px] font-mono text-emerald-400 font-semibold mt-1">
              38/km² Acoustic density
            </div>
          </div>
        </div>

        {/* Card 3: High Priority Targets */}
        <div className="bg-[#040817] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold tracking-wider leading-tight">
              HIGH PRIORITY TARGETS
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-950/40 border border-rose-900/50 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
              18
            </div>
            <div className="text-[11px] font-mono text-rose-400 font-semibold mt-1">
              Immediate Action required
            </div>
          </div>
        </div>

        {/* Card 4: Average Confidence */}
        <div className="bg-[#040817] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold tracking-wider leading-tight">
              AVERAGE CONFIDENCE
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-900/50 flex items-center justify-center text-emerald-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
              91.4%
            </div>
            <div className="text-[11px] font-mono text-emerald-400 font-semibold mt-1">
              +2.1% vs Baseline
            </div>
          </div>
        </div>

        {/* Card 5: Mission Coverage */}
        <div className="bg-[#040817] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold tracking-wider leading-tight">
              MISSION COVERAGE
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-900/50 flex items-center justify-center text-cyan-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
              78%
            </div>
            <div className="text-[11px] font-mono text-emerald-400 font-semibold mt-1">
              14.82 km² Surveyed
            </div>
          </div>
        </div>

        {/* Card 6: Validation Pending */}
        <div className="bg-[#040817] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold tracking-wider leading-tight">
              VALIDATION PENDING
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-900/50 flex items-center justify-center text-amber-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
              9
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Queue Awaiting review
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Section Row: ACTIVE MISSION & SYSTEM STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section: ACTIVE MISSION (7 cols) */}
        <div className="lg:col-span-7 bg-[#040817] border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>ACTIVE MISSION</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                ANALYZING
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold text-white tracking-wide">
                Arabian Sea Survey 01
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Mumbai Offshore Shelf Sector 4
              </p>
            </div>

            {/* 4 Mini Metric Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  SURVEY AREA
                </span>
                <span className="text-base font-mono font-bold text-white mt-1 block">
                  14.82 km²
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  FRAMES TOTAL
                </span>
                <span className="text-base font-mono font-bold text-white mt-1 block">
                  12,480
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  COVERAGE
                </span>
                <span className="text-base font-mono font-bold text-cyan-400 mt-1 block">
                  78%
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  EST. COMPLETION
                </span>
                <span className="text-base font-mono font-bold text-amber-400 mt-1 block">
                  18 min
                </span>
              </div>
            </div>
          </div>

          {/* Continuous Swath Processing Progress Bar */}
          <div className="mt-8 pt-4 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
              <span>Continuous Swath Processing</span>
              <span className="text-cyan-400 font-semibold">
                9,734 / 12,480 frames (78%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
              <div
                className="h-full bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50"
                style={{ width: '78%' }}
              />
            </div>
          </div>
        </div>

        {/* Right Section: SYSTEM STATUS (5 cols) */}
        <div className="lg:col-span-5 bg-[#040817] border border-slate-800/80 rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>SYSTEM STATUS</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SUBSEA TELEMETRY</span>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {/* Status 1 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs font-mono">
              <div className="flex items-center gap-2.5 text-slate-200">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>AI Inference Engine</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 text-[10px] font-bold">
                ONLINE (18ms)
              </span>
            </div>

            {/* Status 2 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs font-mono">
              <div className="flex items-center gap-2.5 text-slate-200">
                <Waves className="w-4 h-4 text-cyan-400" />
                <span>Sonar Input Stream</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 text-[10px] font-bold">
                CONNECTED (455 kHz)
              </span>
            </div>

            {/* Status 3 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs font-mono">
              <div className="flex items-center gap-2.5 text-slate-200">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>GPS / USBL Positioning</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 text-[10px] font-bold">
                CONNECTED (3D Fix)
              </span>
            </div>

            {/* Status 4 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs font-mono">
              <div className="flex items-center gap-2.5 text-slate-200">
                <Map className="w-4 h-4 text-cyan-400" />
                <span>Mapping Service</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 text-[10px] font-bold">
                ONLINE (WGS84)
              </span>
            </div>

            {/* Status 5 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs font-mono">
              <div className="flex items-center gap-2.5 text-slate-200">
                <CheckSquare className="w-4 h-4 text-amber-400" />
                <span>Validation Queue</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-800/80 text-[10px] font-bold">
                9 PENDING
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
