import React, { useState, useMemo } from 'react';
import { Detection, DetectionType, PriorityLevel, ValidationStatus } from '../../types';
import {
  Search,
  Crosshair,
  ArrowUpDown,
  FileSpreadsheet,
  Layers,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useToast } from '../common/Toast';

export interface DetectionTableProps {
  detections: Detection[];
  selectedDetection: Detection | null;
  onSelectDetection: (detection: Detection) => void;
  onOpenDetails: (detection: Detection) => void;
}

export function DetectionTable({
  detections,
  selectedDetection,
  onSelectDetection,
  onOpenDetails
}: DetectionTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(0.5);
  const [sortField, setSortField] = useState<'confidence' | 'depth' | 'priority' | 'time'>('confidence');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const { showToast } = useToast();

  const filteredDetections = useMemo(() => {
    return detections
      .filter((d) => {
        const matchesSearch =
          d.targetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.acousticEvidence.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === 'ALL' || d.type === typeFilter;
        const matchesPriority = priorityFilter === 'ALL' || d.priority === priorityFilter;
        const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
        const matchesConfidence = d.confidence >= minConfidence;

        return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesConfidence;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'confidence') {
          comparison = a.confidence - b.confidence;
        } else if (sortField === 'depth') {
          comparison = a.depthMeters - b.depthMeters;
        } else if (sortField === 'time') {
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        } else if (sortField === 'priority') {
          const pOrder: Record<PriorityLevel, number> = {
            'High Priority': 3,
            'Medium Priority': 2,
            'Low Priority': 1
          };
          comparison = pOrder[a.priority] - pOrder[b.priority];
        }
        return sortAsc ? comparison : -comparison;
      });
  }, [detections, searchQuery, typeFilter, priorityFilter, statusFilter, minConfidence, sortField, sortAsc]);

  const handleExportCSV = () => {
    const headers =
      'TargetCode,Name,Type,Priority,Confidence,Status,Latitude,Longitude,DepthMeters,LengthMeters,WidthMeters,HeightMeters,Timestamp\n';
    const rows = filteredDetections
      .map(
        (d) =>
          `"${d.targetCode}","${d.name}","${d.type}","${d.priority}",${d.confidence},"${d.status}",${d.latitude},${d.longitude},${d.depthMeters},${d.dimensions.lengthMeters},${d.dimensions.widthMeters},${d.dimensions.heightMeters},"${d.timestamp}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BUFFERS_Acoustic_Detections_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('CSV Exported', `Generated acoustic registry for ${filteredDetections.length} contacts`, 'success');
  };

  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: filteredDetections.map((d) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [d.longitude, d.latitude, -d.depthMeters]
        },
        properties: {
          targetCode: d.targetCode,
          name: d.name,
          type: d.type,
          priority: d.priority,
          confidence: d.confidence,
          status: d.status,
          dimensions: d.dimensions,
          snrDb: d.snrDb
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BUFFERS_Hazard_GIS_${new Date().toISOString().slice(0, 10)}.geojson`;
    a.click();
    showToast('GeoJSON Exported', 'Exported GIS layer for hydrographic and salvage charting', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Controls & Filter Strip */}
      <div className="bg-[#040817] border border-slate-800/80 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search target code, classification, or evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportGeoJSON}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export GeoJSON</span>
            </button>
          </div>
        </div>

        {/* Multi-criteria Filter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Target Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="Marine Debris">Marine Debris</option>
              <option value="Unknown Anomaly">Unknown Anomaly</option>
              <option value="Fishing Net">Fishing Net</option>
              <option value="Unidentified Object">Unidentified Object</option>
              <option value="Rock Formation">Rock Formation</option>
              <option value="Submerged Pipeline">Submerged Pipeline</option>
              <option value="Shipwreck Section">Shipwreck Section</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Priority Level</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="High Priority">High Priority</option>
              <option value="Medium Priority">Medium Priority</option>
              <option value="Low Priority">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Validation Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="VALIDATED">Validated</option>
              <option value="REJECTED">False Positive</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Min Confidence:</span>
              <span className="text-cyan-400 font-bold">{Math.round(minConfidence * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Sort Field</label>
            <div className="flex items-center gap-1">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="confidence">Confidence</option>
                <option value="priority">Priority</option>
                <option value="depth">Depth</option>
                <option value="time">Time</option>
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
                title={sortAsc ? 'Ascending' : 'Descending'}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detections Data Table */}
      <div className="bg-[#040817] border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>
            Displaying <strong className="text-white">{filteredDetections.length}</strong> of{' '}
            {detections.length} acoustic contacts
          </span>
          <span className="text-cyan-400 font-bold">SIH26057 ACOUSTIC REGISTRY</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-medium">Target Code</th>
                <th className="py-3 px-4 font-medium">Name & Classification</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Coordinates</th>
                <th className="py-3 px-4 font-medium">Depth / SNR</th>
                <th className="py-3 px-4 font-medium">Dimensions</th>
                <th className="py-3 px-4 font-medium">Confidence</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredDetections.map((detection) => {
                const isSelected = selectedDetection?.id === detection.id;

                return (
                  <tr
                    key={detection.id}
                    onClick={() => {
                      onSelectDetection(detection);
                      onOpenDetails(detection);
                    }}
                    className={`hover:bg-slate-800/50 transition-colors cursor-pointer group ${
                      isSelected ? 'bg-cyan-950/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-cyan-400 whitespace-nowrap">
                      {detection.targetCode}
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 block group-hover:text-cyan-300 transition-colors">
                          {detection.name}
                        </span>
                        {(detection.isShipwreckDebris || detection.type === 'Shipwreck Section') && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold uppercase shrink-0">
                            WHOLE SHIP
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {detection.type} · Swath: {detection.swath}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          detection.priority === 'High Priority'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : detection.priority === 'Medium Priority'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {detection.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      {detection.latitude.toFixed(4)}°N, {detection.longitude.toFixed(4)}°E
                    </td>

                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      <div>{detection.depthMeters} m</div>
                      <div className="text-[10px] text-cyan-400 font-semibold">
                        SNR: {detection.snrDb} dB
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      {detection.dimensions.lengthMeters}m × {detection.dimensions.widthMeters}m
                      <div className="text-[10px] text-slate-400">
                        Shadow: {detection.shadowLengthMeters}m
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-emerald-400 font-bold tabular-nums">
                        {(detection.confidence * 100).toFixed(0)}%
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[11px] ${
                          detection.status === 'VALIDATED'
                            ? 'text-emerald-400'
                            : detection.status === 'PENDING'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        ● {detection.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDetection(detection);
                          onOpenDetails(detection);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
