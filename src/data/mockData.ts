import { Mission, Detection, SystemStatus } from '../types';

export const MISSIONS_DATA: Mission[] = [
  {
    id: 'msn-as-01',
    code: 'MSN-AS-01',
    name: 'Arabian Sea Survey 01',
    location: 'Mumbai Offshore Shelf Sector 4',
    status: 'ANALYZING',
    frames: 12480,
    detectionsCount: 327,
    highPriorityCount: 18,
    vessel: 'RV Sagar Nidhi (Mother Ship)',
    surveyAreaKm2: 14.82,
    acousticSonarKhz: 455,
    meanDepthMeters: 36.4,
    surveyDate: '2026-09-27 06:30 IST',
    completionPercent: 78,
    estCompletionMinutes: 18,
    coordinates: [18.4521, 72.8124]
  },
  {
    id: 'msn-kc-02',
    code: 'MSN-KC-02',
    name: 'Konkan Coast Survey',
    location: 'Ratnagiri Benthic Fishery Reserve',
    status: 'COMPLETED',
    frames: 8920,
    detectionsCount: 241,
    highPriorityCount: 9,
    vessel: 'RV Sindhu Sadhana',
    surveyAreaKm2: 11.20,
    acousticSonarKhz: 900,
    meanDepthMeters: 28.2,
    surveyDate: '2026-09-25 09:15 IST',
    completionPercent: 100,
    estCompletionMinutes: 0,
    coordinates: [16.9902, 73.2845]
  },
  {
    id: 'msn-gk-03',
    code: 'MSN-GK-03',
    name: 'Gulf of Khambhat Anomaly Patrol',
    location: 'Tidal Channel Corridor B',
    status: 'STANDBY',
    frames: 6150,
    detectionsCount: 0,
    highPriorityCount: 0,
    vessel: 'ICGS Varuna Patrol Support',
    surveyAreaKm2: 8.40,
    acousticSonarKhz: 455,
    meanDepthMeters: 19.5,
    surveyDate: '2026-09-28 04:00 IST',
    completionPercent: 0,
    estCompletionMinutes: 45,
    coordinates: [21.5320, 72.4180]
  }
];

export const INITIAL_DETECTIONS: Detection[] = [
  {
    id: 'det-001',
    targetCode: 'TGT-001',
    frameId: 'FRM-10482',
    name: 'Possible Marine Debris Field',
    type: 'Marine Debris',
    priority: 'High Priority',
    confidence: 0.96,
    status: 'PENDING',
    latitude: 18.4521,
    longitude: 72.8124,
    depthMeters: 34.7,
    slantRangeMeters: 42.1,
    slantRangeCorr: '1.04x',
    timestamp: '2026-09-27 10:42:18 IST',
    dimensions: {
      lengthMeters: 3.2,
      widthMeters: 1.4,
      heightMeters: 1.1
    },
    snrDb: 18.4,
    shadowLengthMeters: 8.2,
    reliefAboveBedMeters: 2.1,
    swath: 'PORT',
    acousticEvidence: 'Strong acoustic highlight with 8.2m acoustic shadow cast across port swath',
    bayesianReasoning: 'High-confidence object-like structure with supporting acoustic shadow. Geometric aspect ratio suggests synthetic metal container or heavy industrial debris.',
    image: '/src/assets/images/sonar_debris_field_1790596355148.jpg'
  },
  {
    id: 'det-002',
    targetCode: 'TGT-002',
    frameId: 'FRM-10519',
    name: 'Submerged Shipping Container',
    type: 'Marine Debris',
    priority: 'High Priority',
    confidence: 0.94,
    status: 'PENDING',
    latitude: 18.4615,
    longitude: 72.8230,
    depthMeters: 36.1,
    slantRangeMeters: 38.5,
    slantRangeCorr: '1.02x',
    timestamp: '2026-09-27 10:48:02 IST',
    dimensions: {
      lengthMeters: 12.2,
      widthMeters: 2.4,
      heightMeters: 2.6
    },
    snrDb: 21.2,
    shadowLengthMeters: 11.4,
    reliefAboveBedMeters: 2.5,
    swath: 'STARBOARD',
    acousticEvidence: 'Rectangular specular echo profile with sharp acoustic shadow extinction',
    bayesianReasoning: 'Consistent with 40ft standard intermodal cargo container lost during monsoon sea state 5.',
    image: '/src/assets/images/sonar_debris_field_1790596355148.jpg'
  },
  {
    id: 'det-003',
    targetCode: 'TGT-003',
    frameId: 'FRM-10604',
    name: 'Entangled Ghost Fishing Net',
    type: 'Fishing Net',
    priority: 'Medium Priority',
    confidence: 0.88,
    status: 'PENDING',
    latitude: 18.4410,
    longitude: 72.8090,
    depthMeters: 32.5,
    slantRangeMeters: 29.0,
    slantRangeCorr: '1.05x',
    timestamp: '2026-09-27 10:55:40 IST',
    dimensions: {
      lengthMeters: 18.5,
      widthMeters: 6.2,
      heightMeters: 1.8
    },
    snrDb: 14.8,
    shadowLengthMeters: 6.5,
    reliefAboveBedMeters: 1.7,
    swath: 'PORT',
    acousticEvidence: 'Diffuse web-like backscatter with trailing acoustic attenuation',
    bayesianReasoning: 'Floating net agglomeration weighted down by bottom anchors; presents propeller foul hazard.',
    image: '/src/assets/images/sonar_waterfall_scan_1790596329548.jpg'
  },
  {
    id: 'det-004',
    targetCode: 'TGT-004',
    frameId: 'FRM-10688',
    name: 'Exposed Pipeline Rupture',
    type: 'Submerged Pipeline',
    priority: 'High Priority',
    confidence: 0.95,
    status: 'PENDING',
    latitude: 18.4720,
    longitude: 72.8340,
    depthMeters: 38.0,
    slantRangeMeters: 45.2,
    slantRangeCorr: '1.03x',
    timestamp: '2026-09-27 11:02:15 IST',
    dimensions: {
      lengthMeters: 35.0,
      widthMeters: 1.2,
      heightMeters: 1.4
    },
    snrDb: 19.6,
    shadowLengthMeters: 7.8,
    reliefAboveBedMeters: 1.6,
    swath: 'STARBOARD',
    acousticEvidence: 'Continuous linear reflection with localized free-span shadow underneath',
    bayesianReasoning: 'Scour-induced spanning across seabed trough; risk of structural vortex shedding vibration.',
    image: '/src/assets/images/sonar_hazard_pipe_1790596367335.jpg'
  },
  {
    id: 'det-005',
    targetCode: 'TGT-005',
    frameId: 'FRM-10722',
    name: 'Whole Sunken Vessel & Debris Field',
    type: 'Shipwreck Section',
    priority: 'High Priority',
    confidence: 0.98,
    status: 'PENDING',
    latitude: 18.4590,
    longitude: 72.8180,
    depthMeters: 35.2,
    slantRangeMeters: 36.4,
    slantRangeCorr: '1.01x',
    timestamp: '2026-09-27 11:10:50 IST',
    dimensions: {
      lengthMeters: 68.4,
      widthMeters: 14.2,
      heightMeters: 6.8
    },
    snrDb: 27.5,
    shadowLengthMeters: 22.4,
    reliefAboveBedMeters: 6.8,
    swath: 'PORT',
    acousticEvidence: 'Massive acoustic reflection from 68m intact hull structure with 22.4m shadow extinction, flanked by wide debris field',
    bayesianReasoning: 'Intact cargo vessel keel, superstructure, and scattered cargo debris field. Acute navigation clearance priority.',
    image: '/src/assets/images/whole_ship_debris_1790597646950.jpg',
    isShipwreckDebris: true
  },
  {
    id: 'det-006',
    targetCode: 'TGT-006',
    frameId: 'FRM-10785',
    name: 'Unidentified Metal Debris',
    type: 'Unidentified Object',
    priority: 'Medium Priority',
    confidence: 0.84,
    status: 'PENDING',
    latitude: 18.4380,
    longitude: 72.8250,
    depthMeters: 31.8,
    slantRangeMeters: 33.1,
    slantRangeCorr: '1.04x',
    timestamp: '2026-09-27 11:18:22 IST',
    dimensions: {
      lengthMeters: 4.5,
      widthMeters: 2.1,
      heightMeters: 1.2
    },
    snrDb: 16.2,
    shadowLengthMeters: 5.1,
    reliefAboveBedMeters: 1.3,
    swath: 'STARBOARD',
    acousticEvidence: 'Angular specular highlight consistent with fabricated metallic casing',
    bayesianReasoning: 'Likely machinery frame washed off barge deck.',
    image: '/src/assets/images/sonar_debris_field_1790596355148.jpg'
  },
  {
    id: 'det-007',
    targetCode: 'TGT-007',
    frameId: 'FRM-10810',
    name: 'Bedrock Limestone Outcrop',
    type: 'Rock Formation',
    priority: 'Low Priority',
    confidence: 0.81,
    status: 'PENDING',
    latitude: 18.4680,
    longitude: 72.8050,
    depthMeters: 37.4,
    slantRangeMeters: 48.0,
    slantRangeCorr: '1.06x',
    timestamp: '2026-09-27 11:24:00 IST',
    dimensions: {
      lengthMeters: 14.0,
      widthMeters: 9.2,
      heightMeters: 1.5
    },
    snrDb: 12.0,
    shadowLengthMeters: 6.0,
    reliefAboveBedMeters: 1.4,
    swath: 'PORT',
    acousticEvidence: 'Gradual rough backscatter transition without sharp boundary edge',
    bayesianReasoning: 'Natural geological seabed outcrop; no salvage or clearance action required.'
  },
  {
    id: 'det-008',
    targetCode: 'TGT-008',
    frameId: 'FRM-10845',
    name: 'Suspended Acoustic Anomaly',
    type: 'Unknown Anomaly',
    priority: 'Medium Priority',
    confidence: 0.89,
    status: 'PENDING',
    latitude: 18.4490,
    longitude: 72.8310,
    depthMeters: 33.0,
    slantRangeMeters: 39.5,
    slantRangeCorr: '1.03x',
    timestamp: '2026-09-27 11:30:15 IST',
    dimensions: {
      lengthMeters: 5.8,
      widthMeters: 3.0,
      heightMeters: 2.2
    },
    snrDb: 17.5,
    shadowLengthMeters: 9.0,
    reliefAboveBedMeters: 2.0,
    swath: 'STARBOARD',
    acousticEvidence: 'Distinct shadow detached from acoustic highlight indicating water-column suspension',
    bayesianReasoning: 'Buoyant debris tethered to seafloor clump weight.'
  },
  {
    id: 'det-009',
    targetCode: 'TGT-009',
    frameId: 'FRM-10901',
    name: 'Collapsed Steel Lattice Girder',
    type: 'Marine Debris',
    priority: 'High Priority',
    confidence: 0.93,
    status: 'PENDING',
    latitude: 18.4550,
    longitude: 72.8150,
    depthMeters: 34.0,
    slantRangeMeters: 35.8,
    slantRangeCorr: '1.02x',
    timestamp: '2026-09-27 11:36:40 IST',
    dimensions: {
      lengthMeters: 16.4,
      widthMeters: 4.2,
      heightMeters: 2.8
    },
    snrDb: 20.1,
    shadowLengthMeters: 12.0,
    reliefAboveBedMeters: 2.7,
    swath: 'PORT',
    acousticEvidence: 'Repetitive cross-bracing acoustic echoes and linear shadow silhouettes',
    bayesianReasoning: 'Crane boom or derrick section dumped after offshore rig installation.'
  }
];

export const INITIAL_SYSTEM_STATUS: SystemStatus = {
  aiInferenceEngine: { status: 'ONLINE', latencyMs: 18 },
  sonarInputStream: { status: 'CONNECTED', freqKhz: 455 },
  gpsUsblPositioning: { status: 'CONNECTED', fix: '3D Fix' },
  mappingService: { status: 'ONLINE', crs: 'WGS84' },
  validationQueueCount: 9
};

// Detections timeline data for the report chart
export const DETECTIONS_TIMELINE_DATA = [
  { time: '06:00', detections: 12 },
  { time: '07:00', detections: 48 },
  { time: '08:00', detections: 110 },
  { time: '09:00', detections: 195 },
  { time: '10:00', detections: 275 },
  { time: '11:00', detections: 340 }
];

// Confidence spectrum distribution
export const CONFIDENCE_SPECTRUM_DATA = [
  { bucket: '60–70%', count: 1 },
  { bucket: '70–80%', count: 1 },
  { bucket: '80–90%', count: 3 },
  { bucket: '90–100%', count: 9 }
];

// Marine Contact Taxonomy Breakdown
export const TAXONOMY_DATA = [
  { category: 'Marine Debris', count: 5 },
  { category: 'Unknown Anomaly', count: 2 },
  { category: 'Fishing Net', count: 2 },
  { category: 'Unidentified Object', count: 2 },
  { category: 'Rock Formation', count: 1 },
  { category: 'Submerged Pipeline', count: 1 },
  { category: 'Shipwreck Section', count: 1 }
];
