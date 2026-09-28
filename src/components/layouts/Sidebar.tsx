import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Crosshair,
  MapPin,
  CheckSquare,
  FileText,
  Settings,
  Waves,
  ShieldAlert,
  Ship
} from 'lucide-react';

export type NavItem =
  | 'overview'
  | 'sonar-analysis'
  | 'shipwreck-debris'
  | 'detection-results'
  | 'priority-map'
  | 'validation'
  | 'mission-reports'
  | 'settings';

export interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  pendingValidationCount: number;
  highPriorityCount: number;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  pendingValidationCount,
  highPriorityCount
}: SidebarProps) {
  const navItems: {
    id: NavItem;
    label: string;
    icon: React.ElementType;
    badgeText?: string;
    badgeStyle?: 'cyan' | 'red' | 'amber';
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: 'sonar-analysis',
      label: 'Sonar Analysis',
      icon: Radio,
      badgeText: 'LIVE',
      badgeStyle: 'cyan'
    },
    {
      id: 'shipwreck-debris',
      label: 'Shipwreck & Debris',
      icon: Ship,
      badgeText: 'WHOLE SHIP',
      badgeStyle: 'cyan'
    },
    {
      id: 'detection-results',
      label: 'Detection Results',
      icon: Crosshair,
      badgeText: `${highPriorityCount} HIGH`,
      badgeStyle: 'red'
    },
    {
      id: 'priority-map',
      label: 'Priority Map',
      icon: MapPin
    },
    {
      id: 'validation',
      label: 'Validation',
      icon: CheckSquare,
      badgeText: `${pendingValidationCount}`,
      badgeStyle: 'amber'
    },
    {
      id: 'mission-reports',
      label: 'Mission Reports',
      icon: FileText
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#040816] border-r border-slate-800/80 flex flex-col justify-between select-none">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner shadow-cyan-500/20">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-base font-bold tracking-wide text-white">
                  BUFFERS
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  SIH26057
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-1">
                Underwater Sonar Intelligence
              </p>
            </div>
          </div>

          {/* Sub Disaster Management Badge Card */}
          <div className="mt-3.5 p-2.5 rounded-lg bg-slate-900/60 border border-cyan-900/40">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>DISASTER MANAGEMENT</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
              Side-Scan Sonar Marine Debris & Anomaly Edge Detection
            </p>
          </div>
        </div>

        {/* Command Operations Navigation */}
        <div className="p-3">
          <div className="px-3 pt-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            COMMAND OPERATIONS
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-950 font-semibold'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-cyan-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badgeText && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        item.badgeStyle === 'cyan'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : item.badgeStyle === 'red'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {item.badgeText}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Subsystem Telemetry Card at Bottom */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-white tracking-wider">BUFFERS</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              SIH 2026
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">System Status:</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80 flex justify-between">
            <span>Edge Sonar AI Node</span>
            <span className="text-cyan-400 font-semibold">Active (455 kHz)</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
