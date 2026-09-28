import React, { useState } from 'react';
import {
  AISettings,
  MapSettings,
  SystemConfig
} from '../../types';
import {
  Sliders,
  Cpu,
  Waves,
  Map,
  HardDrive,
  CheckCircle2,
  Save,
  RotateCcw,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { useToast } from '../common/Toast';

export interface SettingsPageProps {
  aiSettings: AISettings;
  mapSettings: MapSettings;
  systemConfig: SystemConfig;
  onSaveAISettings: (settings: AISettings) => void;
  onSaveMapSettings: (settings: MapSettings) => void;
  onSaveSystemConfig: (config: SystemConfig) => void;
}

export function SettingsPage({
  aiSettings,
  mapSettings,
  systemConfig,
  onSaveAISettings,
  onSaveMapSettings,
  onSaveSystemConfig
}: SettingsPageProps) {
  const [localAi, setLocalAi] = useState<AISettings>(aiSettings);
  const [localMap, setLocalMap] = useState<MapSettings>(mapSettings);
  const [localSys, setLocalSys] = useState<SystemConfig>(systemConfig);
  const { showToast } = useToast();

  const handleSaveAll = () => {
    onSaveAISettings(localAi);
    onSaveMapSettings(localMap);
    onSaveSystemConfig(localSys);
    showToast('Configuration Saved', 'Acoustic parameters and AI thresholds updated across subsystem', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-lg p-4">
        <div>
          <h1 className="font-mono text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Sonar & AI Calibration Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure real-time YOLO deep learning parameters, hydrographic sound velocity, and GIS layers
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs transition-colors shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Apply Calibration</span>
        </button>
      </div>

      {/* Section 1: AI Model Configuration */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white">
            AI Inference & Detection Thresholds
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Active Neural Architecture:
            </label>
            <input
              type="text"
              readOnly
              value={localAi.modelName}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-cyan-300 font-semibold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Inference Hardware Acceleration:
            </label>
            <select
              value={localAi.inferenceDevice}
              onChange={(e) =>
                setLocalAi({ ...localAi, inferenceDevice: e.target.value as any })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="EDGE_GPU">AUV Embedded Edge GPU (NVIDIA Jetson)</option>
              <option value="SURFACE_SERVER">Surface Vessel Server (RTX 4090)</option>
              <option value="HYBRID">Hybrid Edge-Cloud Telemetry</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Candidate Confidence Cutoff:</span>
              <span className="text-cyan-400 font-bold">
                {Math.round(localAi.confidenceThreshold * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.4"
              max="0.9"
              step="0.05"
              value={localAi.confidenceThreshold}
              onChange={(e) =>
                setLocalAi({ ...localAi, confidenceThreshold: parseFloat(e.target.value) })
              }
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>NMS IoU Suppression Overlap:</span>
              <span className="text-cyan-400 font-bold">
                {Math.round(localAi.nmsIouThreshold * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.7"
              step="0.05"
              value={localAi.nmsIouThreshold}
              onChange={(e) =>
                setLocalAi({ ...localAi, nmsIouThreshold: parseFloat(e.target.value) })
              }
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-4 border-t border-slate-800 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localAi.enableShadowHeightEstimation}
              onChange={(e) =>
                setLocalAi({ ...localAi, enableShadowHeightEstimation: e.target.checked })
              }
              className="rounded accent-cyan-500"
            />
            <span className="text-slate-300">Automated Acoustic Shadow-to-Height Derivation</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localAi.enableSpecularHighlightFilter}
              onChange={(e) =>
                setLocalAi({ ...localAi, enableSpecularHighlightFilter: e.target.checked })
              }
              className="rounded accent-cyan-500"
            />
            <span className="text-slate-300">Specular Highlight False-Positive Rejection</span>
          </label>
        </div>
      </div>

      {/* Section 2: Sonar Hydrographic Calibration */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Waves className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white">
            Sonar Acoustics & Transducer Calibration
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Dual-Frequency Operating Mode:
            </label>
            <select
              value={localSys.dualFrequencyMode}
              onChange={(e) =>
                setLocalSys({ ...localSys, dualFrequencyMode: e.target.value as any })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="455_900_KHZ">455 kHz (Wide Area) & 900 kHz (High Res Target)</option>
              <option value="900_1600_KHZ">900 kHz & 1600 kHz (Ultra Fine Clutter Search)</option>
              <option value="SINGLE_455_KHZ">Single Frequency 455 kHz (Maximum Battery Range)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Towfish Depth Offset (m):
            </label>
            <input
              type="number"
              step="0.1"
              value={localSys.towfishDepthOffsetMeters}
              onChange={(e) =>
                setLocalSys({
                  ...localSys,
                  towfishDepthOffsetMeters: parseFloat(e.target.value) || 0
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Telemetry Streaming Frequency (Hz):
            </label>
            <input
              type="number"
              value={localSys.telemetryStreamRateHz}
              onChange={(e) =>
                setLocalSys({
                  ...localSys,
                  telemetryStreamRateHz: parseInt(e.target.value) || 1
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Acoustic Sampling Rate (kHz):
            </label>
            <input
              type="number"
              value={localSys.samplingFrequencyKhz}
              onChange={(e) =>
                setLocalSys({
                  ...localSys,
                  samplingFrequencyKhz: parseInt(e.target.value) || 455
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Storage & System Health */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white">
            High-Capacity NVMe Acoustic Buffer
          </h2>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between text-slate-400">
            <span>NVMe Solid-State Storage Used:</span>
            <span className="text-slate-100 font-semibold tabular-nums">
              {localSys.storageUsedGb} GB / {localSys.maxStorageGb} GB (42% Full)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${(localSys.storageUsedGb / localSys.maxStorageGb) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
