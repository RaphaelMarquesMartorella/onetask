import { api } from "@/lib/api";
import { DashboardMetrics, ProjectMetrics } from "@/types/metrics";

export const metricsService = {
  getDashboard: async (): Promise<DashboardMetrics> => {
    const response = await api.get<DashboardMetrics>("/api/metrics/dashboard");
    return response.data;
  },

  getProject: async (projectId: string): Promise<ProjectMetrics> => {
    const response = await api.get<ProjectMetrics>(`/api/metrics/projects/${projectId}`);
    return response.data;
  },
};
