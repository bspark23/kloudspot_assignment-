// Simulation control API - Real backend only
import { apiClient } from './apiClient';

export interface SimulationStatus {
  running: boolean;
  message?: string;
}

export const simulationApi = {
  // GET /api/sim/start - Start occupancy simulator
  async startSimulation(): Promise<SimulationStatus> {
    return await apiClient.get<SimulationStatus>('/api/sim/start');
  },

  // GET /api/sim/stop - Stop occupancy simulator
  async stopSimulation(): Promise<SimulationStatus> {
    return await apiClient.get<SimulationStatus>('/api/sim/stop');
  }
};