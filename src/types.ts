export type DetectionType =
  | 'Marine Debris'
  | 'Unknown Anomaly'
  | 'Fishing Net'
  | 'Unidentified Object'
  | 'Rock Formation'
  | 'Submerged Pipeline'
  | 'Shipwreck Section';

export type PriorityLevel = 'High Priority' | 'Medium Priority' | 'Low Priority';

export type ValidationStatus = 'PENDING' | 'VALIDATED' | 'REJECTED';

export interface Detection {
  id: string;
  targetCode: string;
  frameId: string;
  name: string;
  type: DetectionType;
  priority: PriorityLevel;
  confidence: number;
  status: ValidationStatus;
  latitude: number;
  longitude: number;
  depthMeters: number;
  slantRangeMeters: number;
  slantRangeCorr: string;
  timestamp: string;
  dimensions: {
    lengthMeters: number;
    widthMeters: number;
    heightMeters: number;
  };
  snrDb: number;
  shadowLengthMeters: number;
  reliefAboveBedMeters: number;
  swath: 'PORT' | 'STARBOARD';
  acousticEvidence: string;
  bayesianReasoning: string;
  operatorNotes?: string;
  image?: string;
  isShipwreckDebris?: boolean;
}

export interface Mission {
  id: string;
  code: string;
  name: string;
  location: string;
  status: 'ANALYZING' | 'COMPLETED' | 'STANDBY';
  frames: number;
  detectionsCount: number;
  highPriorityCount: number;
  vessel: string;
  surveyAreaKm2: number;
  acousticSonarKhz: number;
  meanDepthMeters: number;
  surveyDate: string;
  completionPercent: number;
  estCompletionMinutes: number;
  coordinates: [number, number];
}

export interface SystemStatus {
  aiInferenceEngine: { status: 'ONLINE'; latencyMs: number };
  sonarInputStream: { status: 'CONNECTED'; freqKhz: number };
  gpsUsblPositioning: { status: 'CONNECTED'; fix: string };
  mappingService: { status: 'ONLINE'; crs: string };
  validationQueueCount: number;
}

export interface AISettings {
  modelName: string;
  confidenceThreshold: number;
  nmsIouThreshold: number;
  minTargetLengthMeters: number;
  enableShadowHeightEstimation: boolean;
  enableSpecularHighlightFilter: boolean;
  inferenceDevice: 'EDGE_GPU' | 'SURFACE_SERVER' | 'HYBRID';
  autoValidateAboveConfidence: number;
  segmentationResolution: 'STANDARD_512' | 'HIGH_1024' | 'ULTRA_2048';
}

export interface MapSettings {
  defaultCenter: [number, number];
  defaultZoom: number;
  showTracklines: boolean;
  showSwathCoverage: boolean;
  showBathymetryContours: boolean;
  showHazardHeatmap: boolean;
  tileLayer: 'DARK_HYDRO' | 'OCEAN_BASE' | 'SATELLITE_HYBRID';
}

export interface SystemConfig {
  auvVehicleId: string;
  sonarModel: string;
  dualFrequencyMode: '455_900_KHZ' | '900_1600_KHZ' | 'SINGLE_455_KHZ';
  towfishDepthOffsetMeters: number;
  samplingFrequencyKhz: number;
  telemetryStreamRateHz: number;
  storageUsedGb: number;
  maxStorageGb: number;
  backupCloudSync: boolean;
}
