import { Detection, ValidationStatus, DetectionType } from '../types';
import { INITIAL_DETECTIONS } from '../data/mockData';

class MockApiService {
  private detections: Detection[] = [...INITIAL_DETECTIONS];

  async getDetections(): Promise<Detection[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.detections]), 150);
    });
  }

  async submitValidation(
    id: string,
    update: {
      status: ValidationStatus;
      type?: DetectionType;
      notes?: string;
    }
  ): Promise<Detection> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.detections.findIndex((d) => d.id === id);
        if (index === -1) {
          reject(new Error(`Target ID ${id} not found in acoustic registry`));
          return;
        }

        const existing = this.detections[index];
        const updated: Detection = {
          ...existing,
          status: update.status,
          type: update.type || existing.type,
          operatorNotes: update.notes !== undefined ? update.notes : existing.operatorNotes,
        };

        this.detections[index] = updated;
        resolve(updated);
      }, 120);
    });
  }

  async runInferenceScan(frameId: string): Promise<{
    processedPings: number;
    newDetectionsCount: number;
    executionTimeMs: number;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          processedPings: 2400,
          newDetectionsCount: 1,
          executionTimeMs: 42.6,
        });
      }, 800);
    });
  }
}

export const mockApiService = new MockApiService();
