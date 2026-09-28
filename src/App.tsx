/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Mission,
  Detection,
  SystemStatus,
  ValidationStatus,
  DetectionType
} from './types';
import {
  MISSIONS_DATA,
  INITIAL_DETECTIONS,
  INITIAL_SYSTEM_STATUS
} from './data/mockData';
import { Sidebar, NavItem } from './components/layouts/Sidebar';
import { Topbar } from './components/layouts/Topbar';
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { SonarAnalysisPage } from './components/sonar/SonarAnalysisPage';
import { ShipwreckDebrisViewer } from './components/sonar/ShipwreckDebrisViewer';
import { DetectionTable } from './components/detections/DetectionTable';
import { DetectionDrawer } from './components/detections/DetectionDrawer';
import { PriorityMap } from './components/map/PriorityMap';
import { ValidationWorkspace } from './components/validation/ValidationWorkspace';
import { MissionReports } from './components/reports/MissionReports';
import { SettingsPage } from './components/settings/SettingsPage';
import { ToastProvider, useToast } from './components/common/Toast';
import { mockApiService } from './services/mockApi';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavItem>('shipwreck-debris');
  const [missions, setMissions] = useState<Mission[]>(MISSIONS_DATA);
  const [currentMission, setCurrentMission] = useState<Mission>(MISSIONS_DATA[0]);
  const [detections, setDetections] = useState<Detection[]>(INITIAL_DETECTIONS);
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [focusedCoordinates, setFocusedCoordinates] = useState<[number, number] | null>(null);

  const [systemStatus] = useState<SystemStatus>(INITIAL_SYSTEM_STATUS);
  const { showToast } = useToast();

  // Metrics
  const pendingCount = detections.filter((d) => d.status === 'PENDING').length;
  const highPriorityCount = detections.filter((d) => d.priority === 'High Priority').length;

  // Handlers
  const handleSelectDetection = (detection: Detection) => {
    setSelectedDetection(detection);
  };

  const handleOpenDetailsDrawer = (detection: Detection) => {
    setSelectedDetection(detection);
    setIsDrawerOpen(true);
  };

  const handleOpenShipwreckDebris = (detection?: Detection) => {
    if (detection) {
      setSelectedDetection(detection);
    }
    setCurrentTab('shipwreck-debris');
    showToast(
      'Whole Ship Debris Scanner',
      'High-resolution acoustic reconstruction and 3D hazard perimeter loaded.',
      'info'
    );
  };

  const handleOpenOnMap = (detection: Detection) => {
    setFocusedCoordinates([detection.latitude, detection.longitude]);
    setCurrentTab('priority-map');
    showToast(
      'Navigated to Priority Map',
      `Target ${detection.targetCode} focused at ${detection.latitude.toFixed(4)}°N`,
      'info'
    );
  };

  const handleValidateDetection = async (detection: Detection) => {
    const updated = await mockApiService.submitValidation(detection.id, {
      status: 'VALIDATED'
    });
    setDetections((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setSelectedDetection(updated);
    showToast(
      'Target Confirmed',
      `${detection.targetCode} verified by hydrographer.`,
      'success'
    );
  };

  const handleRejectDetection = async (detection: Detection) => {
    const updated = await mockApiService.submitValidation(detection.id, {
      status: 'REJECTED'
    });
    setDetections((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setSelectedDetection(updated);
    showToast(
      'Target Rejected',
      `${detection.targetCode} marked as False Positive.`,
      'info'
    );
  };

  const handleAddNoteToDetection = async (detection: Detection, noteText: string) => {
    const updated = await mockApiService.submitValidation(detection.id, {
      status: detection.status,
      notes: noteText
    });
    setDetections((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setSelectedDetection(updated);
  };

  const handleUpdateFromValidation = async (
    id: string,
    status: ValidationStatus,
    newType?: DetectionType,
    notes?: string
  ) => {
    const updated = await mockApiService.submitValidation(id, {
      status,
      type: newType,
      notes
    });
    setDetections((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    if (selectedDetection?.id === id) {
      setSelectedDetection(updated);
    }
  };

  const handleSelectMission = (mission: Mission) => {
    setCurrentMission(mission);
    showToast(
      'Mission Switched',
      `Active telemetry redirected to ${mission.name}`,
      'info'
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#02050E] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Fixed Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingValidationCount={pendingCount}
        highPriorityCount={highPriorityCount}
      />

      {/* Main Command Center Layout */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Telemetry & Operations Bar */}
        <Topbar
          missions={missions}
          currentMission={currentMission}
          onSelectMission={handleSelectMission}
          unreadAlertCount={highPriorityCount}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#02050E]">
          {currentTab === 'overview' && (
            <OverviewDashboard
              mission={currentMission}
              detections={detections}
              systemStatus={systemStatus}
              onNavigateTab={setCurrentTab}
              onOpenShipwreckDebris={() => handleOpenShipwreckDebris()}
            />
          )}

          {currentTab === 'sonar-analysis' && (
            <SonarAnalysisPage
              detections={detections}
              selectedDetection={selectedDetection}
              onSelectDetection={handleSelectDetection}
              onOpenDetailsDrawer={handleOpenDetailsDrawer}
              onOpenShipwreckDebris={handleOpenShipwreckDebris}
            />
          )}

          {currentTab === 'shipwreck-debris' && (
            <ShipwreckDebrisViewer
              shipwreckDetection={
                selectedDetection?.isShipwreckDebris || selectedDetection?.type === 'Shipwreck Section'
                  ? selectedDetection
                  : detections.find((d) => d.isShipwreckDebris || d.type === 'Shipwreck Section') || detections[4]
              }
              onOpenOnMap={handleOpenOnMap}
              onOpenValidation={(detection) => {
                setSelectedDetection(detection);
                setCurrentTab('validation');
              }}
            />
          )}

          {currentTab === 'detection-results' && (
            <div className="space-y-4">
              <div>
                <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-white">
                  AI Detection Results & Contact Registry
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Comprehensive multi-criteria classification and confidence filtering for acoustic contacts
                </p>
              </div>

              <DetectionTable
                detections={detections}
                selectedDetection={selectedDetection}
                onSelectDetection={handleSelectDetection}
                onOpenDetails={handleOpenDetailsDrawer}
              />
            </div>
          )}

          {currentTab === 'priority-map' && (
            <PriorityMap
              mission={currentMission}
              detections={detections}
              selectedDetection={selectedDetection}
              onSelectDetection={handleSelectDetection}
              onOpenDetailsDrawer={handleOpenDetailsDrawer}
              focusedCoordinates={focusedCoordinates}
            />
          )}

          {currentTab === 'validation' && (
            <ValidationWorkspace
              detections={detections}
              onUpdateDetection={handleUpdateFromValidation}
              onOpenShipwreckDebris={handleOpenShipwreckDebris}
            />
          )}

          {currentTab === 'mission-reports' && (
            <MissionReports
              missions={missions}
              detections={detections}
              activeMission={currentMission}
              onSelectMission={handleSelectMission}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              aiSettings={{
                modelName: 'BUFFERS-YOLOv11-Acoustic-Debris-v3.2',
                confidenceThreshold: 0.7,
                nmsIouThreshold: 0.45,
                minTargetLengthMeters: 1.5,
                enableShadowHeightEstimation: true,
                enableSpecularHighlightFilter: true,
                inferenceDevice: 'EDGE_GPU',
                autoValidateAboveConfidence: 0.95,
                segmentationResolution: 'HIGH_1024'
              }}
              mapSettings={{
                defaultCenter: [18.4521, 72.8124],
                defaultZoom: 13,
                showTracklines: true,
                showSwathCoverage: true,
                showBathymetryContours: true,
                showHazardHeatmap: false,
                tileLayer: 'DARK_HYDRO'
              }}
              systemConfig={{
                auvVehicleId: 'AUV-BUFFERS-MARK-IV',
                sonarModel: 'EdgeTech 4205 Dual-Frequency Side Scan',
                dualFrequencyMode: '455_900_KHZ',
                towfishDepthOffsetMeters: 1.2,
                samplingFrequencyKhz: 900,
                telemetryStreamRateHz: 5,
                storageUsedGb: 215.4,
                maxStorageGb: 512.0,
                backupCloudSync: true
              }}
              onSaveAISettings={() => {}}
              onSaveMapSettings={() => {}}
              onSaveSystemConfig={() => {}}
            />
          )}
        </main>
      </div>

      {/* Slide-out Target Details Drawer */}
      <DetectionDrawer
        detection={selectedDetection}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenOnMap={handleOpenOnMap}
        onValidate={handleValidateDetection}
        onReject={handleRejectDetection}
        onAddNote={handleAddNoteToDetection}
        onOpenShipwreckDebris={handleOpenShipwreckDebris}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
