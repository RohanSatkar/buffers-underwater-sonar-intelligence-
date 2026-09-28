import React, { useState } from 'react';
import { Mission } from '../../types';
import {
  ChevronDown,
  Activity,
  Compass,
  Navigation,
  Bell,
  User,
  ShieldCheck,
  RefreshCw,
  Check
} from 'lucide-react';
import { useToast } from '../common/Toast';

export interface TopbarProps {
  missions: Mission[];
  currentMission: Mission;
  onSelectMission: (mission: Mission) => void;
  unreadAlertCount?: number;
}

export function Topbar({
  missions,
  currentMission,
  onSelectMission,
  unreadAlertCount = 9
}: TopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { showToast } = useToast();

  return (
    <header className="bg-[#030712] border-b border-slate-800/80 text-xs select-none z-20">
      {/* Top Banner Row */}
      <div className="h-10 px-6 border-b border-slate-800/60 flex items-center justify-between">
        <div className="font-mono text-xs font-semibold text-slate-300 tracking-wider">
          BUFFERS - Underwater Sonar Intelligence
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded text-[11px] font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>HYDRO-LINK ONLINE</span>
          </div>
          <button
            onClick={() => showToast('Subsea Telemetry Refreshed', 'Synced latest acoustic frame #12,480', 'success')}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Operations Telemetry Bar */}
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        {/* Left Telemetry Group */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Mission Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors text-left cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-cyan-400 uppercase tracking-widest leading-tight">
                  CURRENT MISSION
                </span>
                <span className="font-semibold text-white text-xs">
                  {currentMission.name}
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                {currentMission.status}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[9px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Select Survey Mission
                </div>
                {missions.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectMission(m);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-slate-800 flex items-center justify-between cursor-pointer ${
                      m.id === currentMission.id ? 'bg-cyan-950/40 text-cyan-300 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{m.location}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {m.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Processing Status Indicator */}
          <div className="hidden md:flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-slate-400 text-xs">Processing Status:</span>
          </div>

          {/* Analyzing Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ANALYZING - 78% (18 min est.)</span>
          </div>

          {/* GPS 3D Fix */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 text-[10px]">GPS:</span>
            <span className="text-emerald-400 font-semibold">3D FIX (14 SATS)</span>
          </div>

          {/* AUV Depth */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 text-[10px]">AUV-04:</span>
            <span className="text-cyan-400 font-semibold">28.6m DEPTH</span>
          </div>
        </div>

        {/* Right Officer Profile Group */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => showToast('Tactical Notifications', '9 high priority acoustic contacts awaiting validation', 'warning')}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
            </button>
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center border-2 border-[#030712]">
                {unreadAlertCount}
              </span>
            )}
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-white text-xs">Lt. Cdr. Sharma</span>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono leading-none">
                Lead Sonar Analyst
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
