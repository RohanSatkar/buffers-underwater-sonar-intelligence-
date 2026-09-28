import React, { useState, useRef } from 'react';
import { Mission, Detection } from '../../types';
import {
  FileSpreadsheet,
  Download,
  Activity,
  PieChart,
  BarChart2,
  Layers,
  ArrowRight,
  Check,
  FileText,
  Sparkles,
  Info,
  Calendar,
  Compass,
  Ship,
  TrendingUp,
  ShieldAlert,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../common/Toast';

export interface MissionReportsProps {
  missions: Mission[];
  detections: Detection[];
  activeMission: Mission;
  onSelectMission: (mission: Mission) => void;
}

// Timeline data with rich acoustic telemetry
interface TimelinePoint {
  time: string;
  hour: number;
  cumulativeDetections: number;
  intervalDetections: number;
  swath: 'PORT' | 'STARBOARD' | 'DUAL';
  speedKnots: number;
  event: string;
  snrAvgDb: number;
  highlightTarget?: string;
}

const TIMELINE_DATA: TimelinePoint[] = [
  {
    time: '06:00',
    hour: 6,
    cumulativeDetections: 12,
    intervalDetections: 12,
    swath: 'PORT',
    speedKnots: 3.4,
    event: 'Survey line Alpha commenced along 35m isobath',
    snrAvgDb: 18.2,
    highlightTarget: 'TGT-001 (Port debris cluster)'
  },
  {
    time: '07:00',
    hour: 7,
    cumulativeDetections: 48,
    intervalDetections: 36,
    swath: 'STARBOARD',
    speedKnots: 3.6,
    event: 'Acoustic shadow detected from discarded steel drum',
    snrAvgDb: 19.5,
    highlightTarget: 'TGT-002 (Intermodal Cargo)'
  },
  {
    time: '08:00',
    hour: 8,
    cumulativeDetections: 110,
    intervalDetections: 62,
    swath: 'PORT',
    speedKnots: 3.5,
    event: 'Entering container spill impact corridor',
    snrAvgDb: 21.0,
    highlightTarget: 'TGT-003 (Entangled Driftnet)'
  },
  {
    time: '09:00',
    hour: 9,
    cumulativeDetections: 195,
    intervalDetections: 85,
    swath: 'DUAL',
    speedKnots: 3.8,
    event: 'High-density debris scatter along navigation shelf',
    snrAvgDb: 23.4,
    highlightTarget: 'TGT-004 (Scour-spanning Pipeline)'
  },
  {
    time: '10:00',
    hour: 10,
    cumulativeDetections: 275,
    intervalDetections: 80,
    swath: 'PORT',
    speedKnots: 3.5,
    event: 'TGT-005: Whole Sunken Vessel Keel & Debris Field located',
    snrAvgDb: 27.5,
    highlightTarget: 'TGT-005 (Sunken Vessel 68.4m)'
  },
  {
    time: '11:00',
    hour: 11,
    cumulativeDetections: 340,
    intervalDetections: 65,
    swath: 'STARBOARD',
    speedKnots: 3.7,
    event: 'Mission sector fully encompassed; 100% swath overlap achieved',
    snrAvgDb: 22.8,
    highlightTarget: 'TGT-007 (Discarded Machinery)'
  }
];

// Target Priority categories
interface PriorityTier {
  id: 'HIGH' | 'MEDIUM' | 'LOW';
  label: string;
  count: number;
  percentage: number;
  color: string;
  strokeDasharray: string;
  strokeDashoffset: string;
  actionRequired: string;
  hazardImpact: string;
  examples: string;
}

const PRIORITY_TIERS: PriorityTier[] = [
  {
    id: 'HIGH',
    label: 'High Priority',
    count: 18,
    percentage: 55,
    color: '#F43F5E',
    strokeDasharray: '220 402',
    strokeDashoffset: '0',
    actionRequired: 'ROV optical validation & Notice to Mariners (NOTMAR)',
    hazardImpact: 'Immediate draft clearance obstruction & propeller foul hazard',
    examples: '68m Sunken Hull, Spilled 40ft Containers, Suspended Pipes'
  },
  {
    id: 'LOW',
    label: 'Low Priority',
    count: 6,
    percentage: 20,
    color: '#06B6D4',
    strokeDasharray: '80 402',
    strokeDashoffset: '-225',
    actionRequired: 'Logged into Nautical Charting bathymetric baseline',
    hazardImpact: 'No navigational risk; natural benthic geology',
    examples: 'Bedrock outcrops, smooth sedimentary ridges'
  },
  {
    id: 'MEDIUM',
    label: 'Medium Priority',
    count: 8,
    percentage: 25,
    color: '#F59E0B',
    strokeDasharray: '95 402',
    strokeDashoffset: '-305',
    actionRequired: 'Periodic acoustic monitoring for sediment scour movement',
    hazardImpact: 'Bottom trawler net snag & habitat disturbance',
    examples: 'Submerged monofilament driftnets, collapsed crane boom'
  }
];

// Confidence spectrum buckets
interface ConfidenceBucket {
  bucket: string;
  rangeMin: number;
  rangeMax: number;
  count: number;
  percentage: string;
  snrDbRange: string;
  status: string;
  description: string;
}

const CONFIDENCE_SPECTRUM: ConfidenceBucket[] = [
  {
    bucket: '60–70%',
    rangeMin: 60,
    rangeMax: 70,
    count: 1,
    percentage: '7.1%',
    snrDbRange: '12–14 dB',
    status: 'Borderline Acoustic Backscatter',
    description: 'Diffuse boundary echoes flagged for secondary acoustic survey verification'
  },
  {
    bucket: '70–80%',
    rangeMin: 70,
    rangeMax: 80,
    count: 1,
    percentage: '7.1%',
    snrDbRange: '15–18 dB',
    status: 'Moderate Shadow Extinction',
    description: 'Presents detectable relief but geometric contours are partially silt-obscured'
  },
  {
    bucket: '80–90%',
    rangeMin: 80,
    rangeMax: 90,
    count: 3,
    percentage: '21.4%',
    snrDbRange: '18–22 dB',
    status: 'Strong Geometric Signatures',
    description: 'Sharp linear edges and clear acoustic shadows characteristic of synthetic structures'
  },
  {
    bucket: '90–100%',
    rangeMin: 90,
    rangeMax: 100,
    count: 9,
    percentage: '64.4%',
    snrDbRange: '22–28+ dB',
    status: 'High Specular Target (Confirmed)',
    description: 'Massive acoustic highlights, 15m+ cast shadows, and unmistakable synthetic keel profiles'
  }
];

// Taxonomy categories
interface TaxonomyItem {
  category: string;
  count: number;
  barWidth: number;
  color: string;
  reliefHeight: string;
  hazardLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  description: string;
}

const TAXONOMY_ITEMS: TaxonomyItem[] = [
  {
    category: 'Marine Debris Field',
    count: 5,
    barWidth: 200,
    color: '#06B6D4',
    reliefHeight: '2.1m',
    hazardLevel: 'HIGH',
    description: 'Scattered industrial drums, structural steel components, and cargo container debris'
  },
  {
    category: 'Shipwreck & Debris',
    count: 1,
    barWidth: 60,
    color: '#F43F5E',
    reliefHeight: '6.8m',
    hazardLevel: 'CRITICAL',
    description: '68.4m whole cargo vessel keel, superstructure tower, and 185m debris field'
  },
  {
    category: 'Submerged Pipeline',
    count: 1,
    barWidth: 50,
    color: '#EC4899',
    reliefHeight: '1.6m',
    hazardLevel: 'HIGH',
    description: 'Free-spanning subsea hydrocarbon transit pipeline with localized seabed scour'
  },
  {
    category: 'Ghost Fishing Net',
    count: 2,
    barWidth: 90,
    color: '#F59E0B',
    reliefHeight: '1.7m',
    hazardLevel: 'HIGH',
    description: 'Suspended nylon monofilament nets weighted by clump anchors; propeller hazard'
  },
  {
    category: 'Unknown Anomaly',
    count: 2,
    barWidth: 90,
    color: '#8B5CF6',
    reliefHeight: '2.4m',
    hazardLevel: 'MODERATE',
    description: 'Acoustic reflections requiring ROV camera sweep for definitive classification'
  },
  {
    category: 'Unidentified Object',
    count: 2,
    barWidth: 90,
    color: '#3B82F6',
    reliefHeight: '1.8m',
    hazardLevel: 'MODERATE',
    description: 'Angular acoustic highlights consistent with fabricated marine machinery'
  },
  {
    category: 'Bedrock Formation',
    count: 1,
    barWidth: 50,
    color: '#10B981',
    reliefHeight: '1.2m',
    hazardLevel: 'LOW',
    description: 'Natural seabed bathymetric outcrop with zero navigational obstruction risk'
  }
];

export function MissionReports({
  missions,
  detections,
  activeMission,
  onSelectMission
}: MissionReportsProps) {
  const { showToast } = useToast();

  // Mouse hover interactive states
  const [hoveredTimelineIndex, setHoveredTimelineIndex] = useState<number | null>(4); // default on 10:00 (Shipwreck event)
  const [timelineMouseX, setTimelineMouseX] = useState<number | null>(null);

  const [hoveredPriority, setHoveredPriority] = useState<PriorityTier | null>(PRIORITY_TIERS[0]);
  const [hoveredConfidence, setHoveredConfidence] = useState<ConfidenceBucket | null>(CONFIDENCE_SPECTRUM[3]);
  const [hoveredTaxonomy, setHoveredTaxonomy] = useState<TaxonomyItem | null>(TAXONOMY_ITEMS[1]);

  const timelineSvgRef = useRef<SVGSVGElement | null>(null);

  // Dynamic statistics calculated from active mission
  const totalDetectionsCount = activeMission.detectionsCount;
  const highPriorityCount = activeMission.highPriorityCount;
  const humanValidationsCount = activeMission.id === 'mis-001' ? 5 : activeMission.id === 'mis-002' ? 12 : 8;
  const meanConfidencePercent = activeMission.id === 'mis-001' ? '91.4%' : activeMission.id === 'mis-002' ? '88.7%' : '94.2%';

  // Calculate timeline SVG points dynamically
  const svgWidth = 500;
  const svgHeight = 240;
  const paddingLeft = 45;
  const paddingRight = 20;
  const chartWidth = svgWidth - paddingLeft - paddingRight; // 435
  const chartHeight = 180;
  const maxDetections = 350;

  const points = TIMELINE_DATA.map((pt, i) => {
    const x = paddingLeft + (i / (TIMELINE_DATA.length - 1)) * chartWidth;
    const y = 210 - (pt.cumulativeDetections / maxDetections) * chartHeight;
    return { ...pt, x, y };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} 210 L ${points[0].x} 210 Z`;

  // Handle Timeline mouse move
  const handleTimelineMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!timelineSvgRef.current) return;
    const rect = timelineSvgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgX = (mouseX / rect.width) * svgWidth;
    setTimelineMouseX(svgX);

    // Find closest data point
    let closestIndex = 0;
    let minDistance = Infinity;

    points.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - svgX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    setHoveredTimelineIndex(closestIndex);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'TargetCode,Name,Type,Priority,Confidence,Latitude,Longitude,DepthMeters,SNR_dB\n' +
      detections
        .map(
          (d) =>
            `${d.targetCode},"${d.name}","${d.type}","${d.priority}",${d.confidence},${d.latitude},${d.longitude},${d.depthMeters},${d.snrDb}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeMission.code}_detections_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Successful', 'Mission detection catalog downloaded as CSV', 'success');
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            mission: activeMission,
            summary: {
              totalDetections: activeMission.detectionsCount,
              highPriorityTargets: activeMission.highPriorityCount,
              humanValidations: humanValidationsCount,
              meanConfidence: meanConfidencePercent
            },
            timelineData: TIMELINE_DATA,
            priorityDistribution: PRIORITY_TIERS,
            confidenceSpectrum: CONFIDENCE_SPECTRUM,
            taxonomyBreakdown: TAXONOMY_ITEMS,
            detections: detections
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeMission.code}_hydrographic_archive.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Export Successful', 'Full subsea archive exported in GeoJSON schema', 'success');
  };

  const activeTimelinePoint = hoveredTimelineIndex !== null ? points[hoveredTimelineIndex] : points[4];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-2xl font-bold tracking-wide text-white">
              MISSION REPORTS & ANALYTICS
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              SIH26057
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Realtime hydrographic survey archives, acoustic detection metrics, and interactive charts with hover inspection
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold rounded-lg text-xs transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Dossier</span>
          </button>
        </div>
      </div>

      {/* 3 Mission Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {missions.map((m) => {
          const isSelected = activeMission.id === m.id;

          return (
            <div
              key={m.id}
              onClick={() => {
                onSelectMission(m);
                showToast('Mission Switched', `Active survey report updated to ${m.name}`, 'info');
              }}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#04091A] border-cyan-500/60 shadow-lg shadow-cyan-950 ring-1 ring-cyan-500/40'
                  : 'bg-[#040817] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {m.code}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      m.status === 'ANALYZING'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        : m.status === 'COMPLETED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors">
                  {m.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {m.location}
                </p>

                {/* Metrics 3-Col Strip */}
                <div className="grid grid-cols-3 gap-2 mt-5 text-xs font-mono bg-black/40 p-2.5 rounded-lg border border-slate-800/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Frames</span>
                    <span className="text-white font-bold tabular-nums">
                      {m.frames.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Detections</span>
                    <span className="text-cyan-400 font-bold tabular-nums">
                      {m.detectionsCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">High Pri.</span>
                    <span className="text-rose-400 font-bold tabular-nums">
                      {m.highPriorityCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Ship className="w-3.5 h-3.5 text-cyan-400" />
                  {m.vessel}
                </span>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    isSelected ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'
                  }`}
                >
                  <span>{isSelected ? 'Active Report' : 'Load Report'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Report Section Header */}
      <div className="mt-8 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="font-mono text-base font-bold text-white uppercase tracking-wider">
              DETAILED REPORT: {activeMission.name}
            </h2>
          </div>
          <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Survey Date: <strong className="text-white">{activeMission.surveyDate}</strong></span>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-2 flex-wrap">
          <span>Survey Area: <strong className="text-slate-200">{activeMission.surveyAreaKm2} km²</strong></span>
          <span>•</span>
          <span>Acoustic Frequency: <strong className="text-cyan-400">{activeMission.acousticSonarKhz} kHz</strong></span>
          <span>•</span>
          <span>Mean Depth: <strong className="text-slate-200">{activeMission.meanDepthMeters} m</strong></span>
          <span>•</span>
          <span>Coordinates: <strong className="text-slate-300">{activeMission.coordinates[0].toFixed(4)}°N, {activeMission.coordinates[1].toFixed(4)}°E</strong></span>
        </p>

        {/* 4 Big Numbers Row - Bound Dynamically */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {/* Box 1 */}
          <div className="p-5 rounded-xl bg-[#040817] border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
              TOTAL DETECTIONS
            </span>
            <div className="text-3xl font-mono font-bold text-white mt-1 tabular-nums">
              {totalDetectionsCount}
            </div>
            <div className="text-[11px] font-mono text-cyan-400 font-semibold mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Swath Scanned</span>
            </div>
          </div>

          {/* Box 2 */}
          <div className="p-5 rounded-xl bg-[#040817] border border-slate-800/80 hover:border-rose-500/40 transition-colors">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
              HIGH PRIORITY TARGETS
            </span>
            <div className="text-3xl font-mono font-bold text-rose-500 mt-1 tabular-nums">
              {highPriorityCount}
            </div>
            <div className="text-[11px] font-mono text-rose-400 font-semibold mt-2 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Requires ROV Salvage</span>
            </div>
          </div>

          {/* Box 3 */}
          <div className="p-5 rounded-xl bg-[#040817] border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
              HUMAN VALIDATIONS
            </span>
            <div className="text-3xl font-mono font-bold text-emerald-400 mt-1 tabular-nums">
              {humanValidationsCount}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              9 in validation queue
            </div>
          </div>

          {/* Box 4 */}
          <div className="p-5 rounded-xl bg-[#040817] border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
              MEAN SONAR CONFIDENCE
            </span>
            <div className="text-3xl font-mono font-bold text-cyan-400 mt-1 tabular-nums">
              {meanConfidencePercent}
            </div>
            <div className="text-[11px] font-mono text-emerald-400 font-semibold mt-2">
              High SNR (&gt;18.5 dB)
            </div>
          </div>
        </div>
      </div>

      {/* Four Analytical Charts Grid with Full Hover Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* ========================================================================= */}
        {/* Chart 1: ACOUSTIC DETECTIONS OVER TIME (Interactive Mousemove Timeline)   */}
        {/* ========================================================================= */}
        <div className="bg-[#040817] border border-slate-800/80 hover:border-cyan-500/50 rounded-xl p-5 flex flex-col justify-between transition-colors shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>ACOUSTIC DETECTIONS OVER TIME</span>
              </div>
              <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 px-2 py-0.5 rounded">
                Hover Timeline to Inspect
              </span>
            </div>

            {/* Live Hover Telemetry HUD Banner */}
            <div className="mt-3 p-3 bg-slate-950/90 rounded-lg border border-cyan-500/30 text-xs font-mono flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold">
                  Time: {activeTimelinePoint.time} IST
                </span>
                <span className="text-white font-bold">
                  {activeTimelinePoint.cumulativeDetections} Total Contacts
                </span>
                <span className="text-emerald-400">
                  +{activeTimelinePoint.intervalDetections}/hr
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-bold">
                  {activeTimelinePoint.swath} SWATH
                </span>
                <span>Speed: {activeTimelinePoint.speedKnots} kts</span>
              </div>
            </div>

            {/* SVG Graph Container */}
            <div className="mt-3 h-64 w-full relative">
              <svg
                ref={timelineSvgRef}
                viewBox="0 0 500 240"
                className="w-full h-full overflow-visible cursor-crosshair select-none"
                onMouseMove={handleTimelineMouseMove}
                onMouseLeave={() => setHoveredTimelineIndex(4)}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                  </linearGradient>

                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Grid Lines */}
                <line x1="45" y1="30" x2="480" y2="30" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="45" y1="75" x2="480" y2="75" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="45" y1="120" x2="480" y2="120" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="45" y1="165" x2="480" y2="165" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="45" y1="210" x2="480" y2="210" stroke="#1E293B" />

                {/* Y Axis Labels */}
                <text x="35" y="34" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">350</text>
                <text x="35" y="79" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">260</text>
                <text x="35" y="124" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">175</text>
                <text x="35" y="169" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">85</text>
                <text x="35" y="214" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">0</text>

                {/* Area Under Curve */}
                <path d={areaD} fill="url(#areaGradient)" />

                {/* Glowing Line */}
                <path d={pathD} fill="none" stroke="#06B6D4" strokeWidth="3" filter="url(#glow)" />

                {/* Individual static points */}
                {points.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredTimelineIndex === idx ? 6 : 4}
                    fill={hoveredTimelineIndex === idx ? '#38BDF8' : '#06B6D4'}
                    stroke="#020617"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                ))}

                {/* Interactive Crosshair & Target Indicator on Active Point */}
                {activeTimelinePoint && (
                  <g pointerEvents="none">
                    {/* Vertical dashed crosshair */}
                    <line
                      x1={activeTimelinePoint.x}
                      y1="25"
                      x2={activeTimelinePoint.x}
                      y2="210"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />

                    {/* Horizontal guide line to Y axis */}
                    <line
                      x1="45"
                      y1={activeTimelinePoint.y}
                      x2={activeTimelinePoint.x}
                      y2={activeTimelinePoint.y}
                      stroke="#38BDF8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      opacity="0.6"
                    />

                    {/* Pulsing ring on the active point */}
                    <circle
                      cx={activeTimelinePoint.x}
                      cy={activeTimelinePoint.y}
                      r="12"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      opacity="0.75"
                    />

                    <circle
                      cx={activeTimelinePoint.x}
                      cy={activeTimelinePoint.y}
                      r="6"
                      fill="#FFFFFF"
                      stroke="#0284C7"
                      strokeWidth="2.5"
                    />
                  </g>
                )}

                {/* X Axis Labels */}
                {points.map((pt, idx) => (
                  <text
                    key={idx}
                    x={pt.x}
                    y="228"
                    fill={hoveredTimelineIndex === idx ? '#38BDF8' : '#94A3B8'}
                    fontWeight={hoveredTimelineIndex === idx ? 'bold' : 'normal'}
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="cursor-pointer"
                    onClick={() => setHoveredTimelineIndex(idx)}
                  >
                    {pt.time}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Key Event Callout from timeline hover */}
          <div className="mt-3 p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 font-mono text-xs flex items-center justify-between">
            <span className="text-slate-400 text-[11px] truncate">
              Event: <strong className="text-cyan-300">{activeTimelinePoint.event}</strong>
            </span>
            <span className="text-[10px] text-amber-400 font-bold shrink-0 ml-2">
              {activeTimelinePoint.highlightTarget}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Chart 2: TARGET PRIORITY DISTRIBUTION (Interactive Donut Chart)           */}
        {/* ========================================================================= */}
        <div className="bg-[#040817] border border-slate-800/80 hover:border-cyan-500/50 rounded-xl p-5 flex flex-col justify-between transition-colors shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                <PieChart className="w-4 h-4 text-cyan-400" />
                <span>TARGET PRIORITY DISTRIBUTION</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Hover Slices to Inspect
              </span>
            </div>

            {/* Donut Ring Visual with Dynamic Interactive Center */}
            <div className="py-4 flex items-center justify-center relative">
              <svg viewBox="0 0 200 200" className="w-52 h-52">
                {/* Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="64"
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="24"
                />

                {/* Slices with hover actions */}
                {PRIORITY_TIERS.map((tier) => {
                  const isHovered = hoveredPriority?.id === tier.id;

                  return (
                    <circle
                      key={tier.id}
                      cx="100"
                      cy="100"
                      r="64"
                      fill="none"
                      stroke={tier.color}
                      strokeWidth={isHovered ? 28 : 22}
                      strokeDasharray={tier.strokeDasharray}
                      strokeDashoffset={tier.strokeDashoffset}
                      className="transition-all duration-200 cursor-pointer"
                      style={{
                        filter: isHovered ? `drop-shadow(0 0 8px ${tier.color})` : 'none'
                      }}
                      onMouseEnter={() => setHoveredPriority(tier)}
                    />
                  );
                })}

                {/* Center Dynamic Label */}
                <g pointerEvents="none">
                  <text
                    x="100"
                    y="90"
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="uppercase"
                  >
                    {hoveredPriority ? hoveredPriority.label : 'TOTAL TARGETS'}
                  </text>
                  <text
                    x="100"
                    y="112"
                    textAnchor="middle"
                    fill={hoveredPriority ? hoveredPriority.color : '#FFFFFF'}
                    fontSize="20"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {hoveredPriority ? `${hoveredPriority.percentage}%` : '32 Total'}
                  </text>
                  <text
                    x="100"
                    y="126"
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {hoveredPriority ? `${hoveredPriority.count} contacts` : '100% Surveyed'}
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Interactive Priority Detail Drawer */}
          <div className="space-y-3">
            {hoveredPriority && (
              <div
                className="p-3 rounded-lg border text-xs font-mono space-y-1 transition-all"
                style={{
                  backgroundColor: 'rgba(2, 6, 23, 0.9)',
                  borderColor: hoveredPriority.color
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: hoveredPriority.color }}
                    />
                    {hoveredPriority.label} ({hoveredPriority.count} Targets)
                  </span>
                  <span
                    className="font-bold text-[11px] px-1.5 py-0.5 rounded"
                    style={{
                      color: hoveredPriority.color,
                      backgroundColor: 'rgba(0,0,0,0.6)'
                    }}
                  >
                    {hoveredPriority.percentage}% Share
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  <strong>Action:</strong> {hoveredPriority.actionRequired}
                </p>
                <p className="text-[10px] text-slate-400">
                  Typical: {hoveredPriority.examples}
                </p>
              </div>
            )}

            {/* Legend buttons */}
            <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-800/60 font-mono text-xs">
              {PRIORITY_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onMouseEnter={() => setHoveredPriority(tier)}
                  onClick={() => setHoveredPriority(tier)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors cursor-pointer ${
                    hoveredPriority?.id === tier.id
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-xs"
                    style={{ backgroundColor: tier.color }}
                  />
                  <span>{tier.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Chart 3: CONFIDENCE DISTRIBUTION SPECTRUM (Interactive Bar Chart)         */}
        {/* ========================================================================= */}
        <div className="bg-[#040817] border border-slate-800/80 hover:border-cyan-500/50 rounded-xl p-5 flex flex-col justify-between transition-colors shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>CONFIDENCE DISTRIBUTION SPECTRUM</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Hover Bars to Inspect
              </span>
            </div>

            {/* Hover Tooltip Ribbon */}
            <div className="mt-3 p-3 bg-slate-950/90 rounded-lg border border-cyan-500/30 text-xs font-mono flex items-center justify-between flex-wrap gap-2">
              {hoveredConfidence ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">
                      Bracket: {hoveredConfidence.bucket}
                    </span>
                    <span className="text-white font-bold">
                      {hoveredConfidence.count} Target{hoveredConfidence.count > 1 ? 's' : ''} ({hoveredConfidence.percentage})
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-400 font-semibold">
                    Acoustic SNR: {hoveredConfidence.snrDbRange}
                  </div>
                </>
              ) : (
                <span className="text-slate-400">Hover over any bar to view statistical telemetry</span>
              )}
            </div>

            <div className="mt-3 h-56 w-full relative">
              <svg viewBox="0 0 500 240" className="w-full h-full overflow-visible select-none">
                {/* Horizontal Grid */}
                <line x1="45" y1="30" x2="480" y2="30" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="45" y1="75" x2="480" y2="75" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="45" y1="120" x2="480" y2="120" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="45" y1="165" x2="480" y2="165" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="45" y1="210" x2="480" y2="210" stroke="#1E293B" />

                {/* Y Axis Numbers */}
                <text x="35" y="34" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">12</text>
                <text x="35" y="79" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">9</text>
                <text x="35" y="124" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">6</text>
                <text x="35" y="169" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">3</text>
                <text x="35" y="214" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">0</text>

                {/* Interactive Bars */}
                {CONFIDENCE_SPECTRUM.map((bucket, idx) => {
                  const xPositions = [75, 180, 285, 390];
                  const heights = [15, 15, 45, 135];
                  const yPositions = [195, 195, 165, 75];

                  const isHovered = hoveredConfidence?.bucket === bucket.bucket;

                  return (
                    <g
                      key={bucket.bucket}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredConfidence(bucket)}
                    >
                      <rect
                        x={xPositions[idx]}
                        y={yPositions[idx]}
                        width="55"
                        height={heights[idx]}
                        rx="4"
                        fill={isHovered ? '#38BDF8' : '#06B6D4'}
                        stroke={isHovered ? '#FFFFFF' : 'none'}
                        strokeWidth="1.5"
                        className="transition-all duration-200"
                        style={{
                          filter: isHovered ? 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.7))' : 'none'
                        }}
                      />
                      {/* Top value badge on bar */}
                      <text
                        x={xPositions[idx] + 27.5}
                        y={yPositions[idx] - 6}
                        fill={isHovered ? '#38BDF8' : '#94A3B8'}
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {bucket.count}
                      </text>
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                <text x="102" y="228" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">60–70%</text>
                <text x="207" y="228" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">70–80%</text>
                <text x="312" y="228" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">80–90%</text>
                <text x="417" y="228" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">90–100%</text>
              </svg>
            </div>
          </div>

          {/* Description of active bucket */}
          {hoveredConfidence && (
            <div className="mt-3 p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 font-mono text-xs flex items-center justify-between">
              <span className="text-slate-300 text-[11px]">
                {hoveredConfidence.description}
              </span>
              <span className="text-[10px] text-cyan-400 font-bold shrink-0 ml-2">
                {hoveredConfidence.status}
              </span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* Chart 4: MARINE CONTACT TAXONOMY (Interactive Horizontal Bar Chart)       */}
        {/* ========================================================================= */}
        <div className="bg-[#040817] border border-slate-800/80 hover:border-cyan-500/50 rounded-xl p-5 flex flex-col justify-between transition-colors shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>MARINE CONTACT TAXONOMY & CATEGORIES</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Hover Rows to Inspect
              </span>
            </div>

            {/* Hover Tooltip Ribbon */}
            <div className="mt-3 p-3 bg-slate-950/90 rounded-lg border border-cyan-500/30 text-xs font-mono flex items-center justify-between flex-wrap gap-2">
              {hoveredTaxonomy ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">
                      {hoveredTaxonomy.category}
                    </span>
                    <span className="text-white font-bold">
                      {hoveredTaxonomy.count} Target{hoveredTaxonomy.count > 1 ? 's' : ''}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        hoveredTaxonomy.hazardLevel === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-600'
                          : hoveredTaxonomy.hazardLevel === 'HIGH'
                          ? 'bg-amber-950 text-amber-300 border border-amber-600'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                      }`}
                    >
                      {hoveredTaxonomy.hazardLevel}
                    </span>
                  </div>
                  <span className="text-slate-300 font-semibold">
                    Relief: {hoveredTaxonomy.reliefHeight} above bed
                  </span>
                </>
              ) : (
                <span className="text-slate-400">Hover over any category to view taxonomy classification</span>
              )}
            </div>

            <div className="mt-3 h-56 w-full relative">
              <svg viewBox="0 0 500 240" className="w-full h-full overflow-visible select-none">
                {/* Vertical Grid for X-axis: 0, 2, 4, 6, 8 */}
                <line x1="160" y1="15" x2="160" y2="200" stroke="#1E293B" />
                <line x1="240" y1="15" x2="240" y2="200" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="320" y1="15" x2="320" y2="200" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="400" y1="15" x2="400" y2="200" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="480" y1="15" x2="480" y2="200" stroke="#1E293B" strokeDasharray="3 3" />

                {/* X Axis Numbers */}
                <text x="160" y="215" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">0</text>
                <text x="240" y="215" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">2</text>
                <text x="320" y="215" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">4</text>
                <text x="400" y="215" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">6</text>
                <text x="480" y="215" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">8</text>

                {/* Taxonomy Rows */}
                {TAXONOMY_ITEMS.map((item, idx) => {
                  const y = 20 + idx * 26;
                  const isHovered = hoveredTaxonomy?.category === item.category;

                  return (
                    <g
                      key={item.category}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredTaxonomy(item)}
                    >
                      {/* Label */}
                      <text
                        x="150"
                        y={y + 12}
                        fill={isHovered ? item.color : '#94A3B8'}
                        fontWeight={isHovered ? 'bold' : 'normal'}
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="end"
                      >
                        {item.category}
                      </text>

                      {/* Bar */}
                      <rect
                        x="160"
                        y={y}
                        width={item.barWidth}
                        height="16"
                        rx="3"
                        fill={item.color}
                        opacity={isHovered ? 1 : 0.8}
                        stroke={isHovered ? '#FFFFFF' : 'none'}
                        strokeWidth="1.5"
                        className="transition-all duration-200"
                        style={{
                          filter: isHovered ? `drop-shadow(0 0 8px ${item.color})` : 'none'
                        }}
                      />

                      {/* Count badge on end of bar */}
                      <text
                        x={160 + item.barWidth + 8}
                        y={y + 12}
                        fill={isHovered ? '#FFFFFF' : '#94A3B8'}
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {item.count}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Description of active taxonomy item */}
          {hoveredTaxonomy && (
            <div className="mt-3 p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 font-mono text-xs flex items-center justify-between">
              <span className="text-slate-300 text-[11px] truncate">
                {hoveredTaxonomy.description}
              </span>
              <span className="text-[10px] text-cyan-400 font-bold shrink-0 ml-2">
                Relief: {hoveredTaxonomy.reliefHeight}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
