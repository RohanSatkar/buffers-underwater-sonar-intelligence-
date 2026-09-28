import React, { useState } from 'react';
import { Detection, ValidationStatus, DetectionType } from '../../types';
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Sliders,
  Layers,
  Sparkles,
  Ship,
  Maximize2
} from 'lucide-react';
import { useToast } from '../common/Toast';

export interface ValidationWorkspaceProps {
  detections: Detection[];
  onUpdateDetection: (
    id: string,
    status: ValidationStatus,
    newType?: DetectionType,
    notes?: string
  ) => Promise<void>;
  onOpenShipwreckDebris?: (detection: Detection) => void;
}

export function ValidationWorkspace({
  detections,
  onUpdateDetection,
  onOpenShipwreckDebris
}: ValidationWorkspaceProps) {
  const [filterMode, setFilterMode] = useState<'PENDING' | 'ALL'>('PENDING');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'HIGH_CONTRAST' | 'SHADOW_ISO' | 'AMBER_WATERFALL'>('HIGH_CONTRAST');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const filteredDetections = filterMode === 'PENDING'
    ? detections.filter((d) => d.status === 'PENDING')
    : detections;

  const currentTarget = filteredDetections[currentIndex] || filteredDetections[0] || detections[0];
  const pendingCount = detections.filter((d) => d.status === 'PENDING').length;

  const getImageFilter = () => {
    switch (viewMode) {
      case 'SHADOW_ISO':
        return 'contrast(190%) brightness(75%) grayscale(60%)';
      case 'AMBER_WATERFALL':
        return 'contrast(140%) sepia(90%) hue-rotate(0deg)';
      case 'HIGH_CONTRAST':
      default:
        return 'hue-rotate(150deg) saturate(170%) contrast(145%)';
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredDetections.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleConfirm = async () => {
    if (!currentTarget) return;
    setIsSubmitting(true);
    try {
      await onUpdateDetection(currentTarget.id, 'VALIDATED');
      showToast('Contact Confirmed', `${currentTarget.targetCode} verified as ${currentTarget.type}`, 'success');
      if (currentIndex < filteredDetections.length - 1) {
        setCurrentIndex((i) => i + 1);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!currentTarget) return;
    setIsSubmitting(true);
    try {
      await onUpdateDetection(currentTarget.id, 'REJECTED');
      showToast('Detection Rejected', `${currentTarget.targetCode} classified as false positive`, 'info');
      if (currentIndex < filteredDetections.length - 1) {
        setCurrentIndex((i) => i + 1);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentTarget) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono">
        All targets in queue have been processed!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono text-xl font-bold tracking-wide text-white">
                  HUMAN-IN-THE-LOOP VALIDATION CONSOLE
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-bold uppercase tracking-wider">
                  {pendingCount} AWAITING REVIEW
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Expert maritime verification for uncertain acoustic contacts & disaster hazards
              </p>
            </div>
          </div>
        </div>

        {/* Pagination & Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-1 hover:text-white text-slate-400 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white font-bold px-1">
              Target {currentIndex + 1} of {filteredDetections.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === filteredDetections.length - 1}
              className="p-1 hover:text-white text-slate-400 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => {
                setFilterMode('PENDING');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold ${
                filterMode === 'PENDING'
                  ? 'bg-amber-950 text-amber-300 border border-amber-700/80'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => {
                setFilterMode('ALL');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'ALL'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              All ({detections.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Validation Stage & Side Assessment Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Acoustic Waterfall Stage (Approx 8 cols) */}
        <div className="lg:col-span-8 bg-[#040817] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            {/* Stage Bar Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs text-white">
                <span className="font-bold text-white">{currentTarget.targetCode}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{currentTarget.frameId}</span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-400 font-semibold">
                  {currentTarget.latitude.toFixed(4)}°N, {currentTarget.longitude.toFixed(4)}°E
                </span>
              </div>

              {/* View Mode Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => setViewMode('HIGH_CONTRAST')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    viewMode === 'HIGH_CONTRAST'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  High-Contrast
                </button>
                <button
                  onClick={() => setViewMode('SHADOW_ISO')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    viewMode === 'SHADOW_ISO'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Shadow Isolation
                </button>
                <button
                  onClick={() => setViewMode('AMBER_WATERFALL')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    viewMode === 'AMBER_WATERFALL'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Amber Waterfall
                </button>
              </div>
            </div>

            {/* Interactive Dark Hydrographic Acoustic Stage with Real Imagery */}
            <div className="relative mt-4 h-[420px] rounded-xl bg-black border border-slate-800/80 overflow-hidden flex items-center justify-center group">
              {/* Actual Sonar Image */}
              <img
                src={
                  currentTarget.image ||
                  (currentTarget.isShipwreckDebris || currentTarget.type === 'Shipwreck Section'
                    ? '/src/assets/images/whole_ship_debris_1790597646950.jpg'
                    : '/src/assets/images/sonar_debris_field_1790596355148.jpg')
                }
                alt={currentTarget.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
                style={{ filter: getImageFilter() }}
              />

              {/* Grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(6, 182, 212, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.4) 1px, transparent 1px)',
                  backgroundSize: '32px 32px'
                }}
              />

              {/* Target Bounding Box & Acoustic Analysis Overlay */}
              <div className="absolute inset-x-8 inset-y-10 border-2 border-cyan-400/90 rounded-xl bg-cyan-950/20 pointer-events-none flex flex-col justify-between p-3.5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 bg-black/85 text-cyan-300 border border-cyan-500/60 rounded">
                    {currentTarget.targetCode} · {currentTarget.name}
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-black/85 text-emerald-400 border border-emerald-500/60 rounded">
                    {(currentTarget.confidence * 100).toFixed(1)}% Confidence
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <div className="bg-black/85 p-2 rounded-lg border border-slate-700 text-xs font-mono space-y-0.5">
                    <span className="text-slate-400 text-[10px] block">TARGET EXTENTS</span>
                    <span className="text-white font-bold">
                      {currentTarget.dimensions.lengthMeters}m × {currentTarget.dimensions.widthMeters}m × {currentTarget.dimensions.heightMeters}m
                    </span>
                  </div>

                  <div className="bg-black/85 p-2 rounded-lg border border-cyan-700 text-xs font-mono space-y-0.5 text-right">
                    <span className="text-cyan-400 text-[10px] block">EST. RELIEF / SHADOW</span>
                    <span className="text-cyan-300 font-bold">
                      {currentTarget.reliefAboveBedMeters}m (Shadow: {currentTarget.shadowLengthMeters}m)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Launch Whole Ship Debris View if applicable */}
              {onOpenShipwreckDebris && (
                <button
                  onClick={() => onOpenShipwreckDebris(currentTarget)}
                  className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 text-cyan-200 border border-cyan-400/70 text-xs font-mono font-bold transition-all shadow-xl cursor-pointer"
                >
                  <Ship className="w-4 h-4 text-cyan-400" />
                  <span>Whole Ship Debris Reconstruction</span>
                </button>
              )}

              {/* In-Canvas Bottom Telemetry Bar */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950/90 backdrop-blur border border-slate-800 px-3.5 py-1.5 rounded-lg">
                <span className="text-cyan-400 font-semibold">
                  DEPTH: {currentTarget.depthMeters}m • SLANT RANGE CORR: {currentTarget.slantRangeCorr}
                </span>
                <span>
                  SWATH: {currentTarget.swath} • SNR: {currentTarget.snrDb} dB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right AI Assessment & Decision Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#040817] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                AI PREDICTION ASSESSMENT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800 font-bold uppercase">
                ● HIGH
              </span>
            </div>

            {/* Predicted Classification */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block">
                Predicted Classification:
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {currentTarget.name}
              </h3>
            </div>

            {/* Confidence Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Model Confidence:</span>
                <span className="text-cyan-400 font-bold">
                  {(currentTarget.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${currentTarget.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Acoustic Evidence */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                Acoustic Evidence:
              </span>
              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs text-slate-200 leading-relaxed font-mono">
                {currentTarget.acousticEvidence}
              </div>
            </div>

            {/* Bayesian Reasoning */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                Bayesian Reasoning:
              </span>
              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs text-slate-300 leading-relaxed font-mono">
                {currentTarget.bayesianReasoning}
              </div>
            </div>
          </div>

          {/* Hydrographer Decision Buttons */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
              HYDROGRAPHER DECISION
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Detection</span>
              </button>

              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-rose-400" />
                <span>Reject Detection</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
