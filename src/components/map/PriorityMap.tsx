import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Mission, Detection } from '../../types';
import {
  MapPin,
  Compass,
  Layers,
  ArrowRight
} from 'lucide-react';

export interface PriorityMapProps {
  mission: Mission;
  detections: Detection[];
  selectedDetection: Detection | null;
  onSelectDetection: (detection: Detection) => void;
  onOpenDetailsDrawer: (detection: Detection) => void;
  focusedCoordinates: [number, number] | null;
}

export function PriorityMap({
  mission,
  detections,
  selectedDetection,
  onSelectDetection,
  onOpenDetailsDrawer,
  focusedCoordinates
}: PriorityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tracklinesLayerRef = useRef<L.LayerGroup | null>(null);

  const [showTracklines, setShowTracklines] = useState(true);
  const [showSwaths, setShowSwaths] = useState(true);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HIGH' | 'PENDING'>('ALL');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center: mission.coordinates,
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    // Dark nautical CartoDB basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    map.on('mousemove', (e) => {
      setMouseCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    const markersGroup = L.layerGroup().addTo(map);
    const tracklinesGroup = L.layerGroup().addTo(map);

    markersLayerRef.current = markersGroup;
    tracklinesLayerRef.current = tracklinesGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mission.id]);

  // Update Tracklines and Swath Coverage
  useEffect(() => {
    if (!mapInstanceRef.current || !tracklinesLayerRef.current) return;
    tracklinesLayerRef.current.clearLayers();

    if (!showTracklines) return;

    const [cLat, cLng] = mission.coordinates;
    const lines = [
      [[cLat - 0.025, cLng - 0.03], [cLat + 0.025, cLng - 0.03]],
      [[cLat + 0.025, cLng - 0.015], [cLat - 0.025, cLng - 0.015]],
      [[cLat - 0.025, cLng + 0.00], [cLat + 0.025, cLng + 0.00]],
      [[cLat + 0.025, cLng + 0.015], [cLat - 0.025, cLng + 0.015]],
      [[cLat - 0.025, cLng + 0.03], [cLat + 0.025, cLng + 0.03]],
    ];

    lines.forEach((lineCoords) => {
      if (showSwaths) {
        L.polyline(lineCoords as [number, number][], {
          color: '#06B6D4',
          weight: 22,
          opacity: 0.12,
          lineCap: 'square'
        }).addTo(tracklinesLayerRef.current!);
      }

      L.polyline(lineCoords as [number, number][], {
        color: '#06B6D4',
        weight: 1.5,
        opacity: 0.7,
        dashArray: '4, 4'
      }).addTo(tracklinesLayerRef.current!);
    });

    // Outer boundary box
    L.rectangle(
      [
        [cLat - 0.03, cLng - 0.04],
        [cLat + 0.03, cLng + 0.04]
      ],
      {
        color: '#3B82F6',
        weight: 1,
        fill: true,
        fillColor: '#3B82F6',
        fillOpacity: 0.04,
        dashArray: '6, 6'
      }
    ).addTo(tracklinesLayerRef.current);
  }, [mission, showTracklines, showSwaths]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    const filtered = detections.filter((d) => {
      if (activeFilter === 'HIGH') return d.priority === 'High Priority';
      if (activeFilter === 'PENDING') return d.status === 'PENDING';
      return true;
    });

    filtered.forEach((detection) => {
      const isSelected = selectedDetection?.id === detection.id;
      const isHigh = detection.priority === 'High Priority';
      const isMedium = detection.priority === 'Medium Priority';
      const colorHex = isHigh ? '#F43F5E' : isMedium ? '#F59E0B' : '#06B6D4';

      const customIcon = L.divIcon({
        className: 'custom-sonar-marker',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            ${
              isHigh
                ? `<div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(244, 63, 94, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                : ''
            }
            <div style="
              width: 14px; 
              height: 14px; 
              border-radius: 9999px; 
              background: ${colorHex}; 
              border: 2px solid ${isSelected ? '#FFFFFF' : '#030712'}; 
              box-shadow: 0 0 10px ${colorHex};
              z-index: 10;
            "></div>
            <div style="
              position: absolute; 
              bottom: -18px; 
              left: 50%; 
              transform: translateX(-50%); 
              font-family: monospace; 
              font-size: 9px; 
              font-weight: 700; 
              color: #FFFFFF; 
              background: rgba(3, 7, 18, 0.85); 
              padding: 1px 4px; 
              border-radius: 3px; 
              border: 1px solid rgba(255, 255, 255, 0.15); 
              white-space: nowrap;
            ">
              ${detection.targetCode}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([detection.latitude, detection.longitude], {
        icon: customIcon
      });

      marker.on('click', () => {
        onSelectDetection(detection);
        onOpenDetailsDrawer(detection);
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [detections, selectedDetection, activeFilter, onSelectDetection, onOpenDetailsDrawer]);

  useEffect(() => {
    if (focusedCoordinates && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(focusedCoordinates, 15, { duration: 1.2 });
    }
  }, [focusedCoordinates]);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#040817] border border-slate-800/80 rounded-xl p-4">
        <div>
          <h1 className="font-mono text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Geospatial Bathymetry & Priority Map
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime GIS tracking of AUV survey corridors, acoustic contacts, and navigational obstruction zones
          </p>
        </div>

        {/* Filter & Toggle Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {(['ALL', 'HIGH', 'PENDING'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter === 'ALL' ? 'All Contacts' : filter}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowTracklines(!showTracklines)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
              showTracklines
                ? 'bg-slate-800 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            Tracklines
          </button>

          <button
            onClick={() => setShowSwaths(!showSwaths)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
              showSwaths
                ? 'bg-slate-800 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            Swath Coverage
          </button>
        </div>
      </div>

      {/* Map Viewport Area */}
      <div className="relative w-full h-[650px] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden select-none">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Top Left Telemetry HUD */}
        <div className="absolute top-4 left-4 z-10 bg-slate-950/90 backdrop-blur border border-slate-800 p-3 rounded-xl text-xs font-mono space-y-1.5 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
            <span>HYDROGRAPHIC GRID // WGS-84</span>
          </div>
          <div className="text-slate-300 text-[11px]">
            <div>SURVEY CORRIDOR: {mission.surveyAreaKm2} km²</div>
            <div>BATHYMETRY DEPTH: {mission.meanDepthMeters}m</div>
            <div>AUV TRACK SPEED: 3.4 kts</div>
          </div>
          {mouseCoords && (
            <div className="pt-1.5 border-t border-slate-800 text-[10px] text-cyan-300">
              PROBE: {mouseCoords.lat.toFixed(5)}°N, {mouseCoords.lng.toFixed(5)}°E
            </div>
          )}
        </div>

        {/* Floating Bottom Left Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-950/90 backdrop-blur border border-slate-800 p-3 rounded-xl text-xs font-mono space-y-1.5 shadow-xl">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            Contact Threat Legend:
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E] shadow-sm shadow-rose-500/50" />
            <span>High Priority Target</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-sm shadow-amber-500/50" />
            <span>Medium Priority Hazard</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span>Low Priority Anomaly</span>
          </div>
        </div>

        {/* Floating Right Target Quick Navigator */}
        <div className="absolute top-4 right-4 z-10 w-72 max-h-[580px] overflow-y-auto bg-slate-950/90 backdrop-blur border border-slate-800 rounded-xl p-3 space-y-2 shadow-xl hidden md:block">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 border-b border-slate-800 pb-2">
            <span>Acoustic Contacts ({detections.length})</span>
            <span className="text-[10px] text-cyan-400">Click to Fly</span>
          </div>

          <div className="space-y-1.5">
            {detections.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  onSelectDetection(d);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([d.latitude, d.longitude], 15);
                  }
                }}
                className={`w-full text-left p-2 rounded-lg text-xs transition-colors border cursor-pointer ${
                  selectedDetection?.id === d.id
                    ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-cyan-400">{d.targetCode}</span>
                  <span
                    className={
                      d.priority === 'High Priority'
                        ? 'text-rose-400'
                        : d.priority === 'Medium Priority'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }
                  >
                    {d.priority}
                  </span>
                </div>
                <div className="font-semibold text-slate-100 truncate mt-0.5">{d.name}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1 flex justify-between">
                  <span>Depth: {d.depthMeters}m</span>
                  <span>Conf: {(d.confidence * 100).toFixed(0)}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
