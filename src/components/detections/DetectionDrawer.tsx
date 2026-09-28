import React, { useState, useEffect } from 'react';
import { Detection } from '../../types';
import {
  X,
  MapPin,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Ship,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useToast } from '../common/Toast';

export interface DetectionDrawerProps {
  detection: Detection | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenOnMap: (detection: Detection) => void;
  onValidate: (detection: Detection) => void;
  onReject: (detection: Detection) => void;
  onAddNote: (detection: Detection, noteText: string) => void;
  onOpenShipwreckDebris?: (detection: Detection) => void;
}

export function DetectionDrawer({
  detection,
  isOpen,
  onClose,
  onOpenOnMap,
  onValidate,
  onReject,
  onOpenShipwreckDebris
}: DetectionDrawerProps) {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const { showToast } = useToast();

  if (!isOpen || !detection) return null;

  const handleCopyCoordinates = () => {
    const coordString = `${detection.latitude.toFixed(6)}, ${detection.longitude.toFixed(6)}`;
    navigator.clipboard.writeText(coordString);
    setCopiedCoords(true);
    showToast('Coordinates Copied', coordString, 'info');
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const imageSrc =
    detection.image ||
    (detection.type === 'Shipwreck Section' || detection.isShipwreckDebris
      ? '/src/assets/images/whole_ship_debris_1790597646950.jpg'
      : '/src/assets/images/sonar_debris_field_1790596355148.jpg');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-out Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#040817] border-l border-slate-800/80 shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-cyan-400">
                  {detection.targetCode}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    detection.priority === 'High Priority'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : detection.priority === 'Medium Priority'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {detection.priority}
                </span>
                {(detection.isShipwreckDebris || detection.type === 'Shipwreck Section') && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold uppercase">
                    Whole Ship
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-base font-bold text-white mt-1.5 leading-snug">
              {detection.name}
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
              <span>{detection.type}</span>
              <span>·</span>
              <span>Swath: {detection.swath}</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">
                Confidence: {(detection.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="p-5 space-y-5 flex-1 font-mono text-xs">
            {/* Visual Acoustic Box with Real Sonar Imagery */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Acoustic Sonar Imagery
                </span>
                <span className="text-cyan-400">{detection.frameId}</span>
              </div>

              {/* Sonar Image Preview Container */}
              <div className="relative rounded-xl overflow-hidden border border-cyan-500/40 bg-black group">
                <img
                  src={imageSrc}
                  alt={detection.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid dimensional telemetry */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 flex flex-col justify-between p-3 pointer-events-none">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="bg-black/80 px-2 py-0.5 rounded text-white font-bold border border-slate-700">
                      {detection.targetCode}
                    </span>
                    <span className="bg-black/80 px-2 py-0.5 rounded text-cyan-300 font-bold border border-cyan-800">
                      SNR: {detection.snrDb} dB
                    </span>
                  </div>

                  <div className="flex justify-between items-end text-[10px] font-mono">
                    <span className="bg-cyan-950/90 text-cyan-200 border border-cyan-500/50 px-2 py-0.5 rounded font-bold">
                      {detection.dimensions.lengthMeters}m × {detection.dimensions.widthMeters}m × {detection.dimensions.heightMeters}m
                    </span>
                    <span className="bg-amber-950/90 text-amber-200 border border-amber-500/50 px-2 py-0.5 rounded font-bold">
                      Relief: ~{detection.reliefAboveBedMeters}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Button: Inspect Whole Ship Debris */}
              {onOpenShipwreckDebris && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenShipwreckDebris(detection);
                  }}
                  className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-cyan-950 via-cyan-900 to-slate-900 hover:from-cyan-900 hover:to-cyan-800 text-cyan-200 border border-cyan-400/60 rounded-xl font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-950 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ship className="w-4 h-4 text-cyan-400" />
                  <span>Inspect Whole Ship Debris & 3D Reconstruction</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              )}

              {/* Shadow & Relief Specs */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">ACOUSTIC SHADOW</span>
                  <span className="text-white font-bold">{detection.shadowLengthMeters} meters</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">SEABED RELIEF</span>
                  <span className="text-cyan-400 font-bold">~{detection.reliefAboveBedMeters}m above bed</span>
                </div>
              </div>
            </div>

            {/* Geographical Location */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  WGS-84 Coordinates
                </span>
                <button
                  onClick={handleCopyCoordinates}
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedCoords ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCoords ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-xs text-white font-semibold flex items-center justify-between">
                <span>
                  {detection.latitude.toFixed(6)}°N, {detection.longitude.toFixed(6)}°E
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenOnMap(detection);
                  }}
                  className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold rounded text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Focus Map</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Evidence & Reasoning */}
            <div className="space-y-3 font-sans">
              <div>
                <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Acoustic Evidence:
                </span>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono">
                  {detection.acousticEvidence}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Bayesian Reasoning:
                </span>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono">
                  {detection.bayesianReasoning}
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/80 sticky bottom-0 z-10 flex items-center gap-3">
            <button
              onClick={() => onValidate(detection)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm</span>
            </button>
            <button
              onClick={() => onReject(detection)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Reject</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
