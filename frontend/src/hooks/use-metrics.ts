import { useQuery } from "@tanstack/react-query";
import { metricsService } from "@/services/metrics";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["metrics", "dashboard"],
    queryFn: metricsService.getDashboard,
  });
}

export function useProjectMetrics(projectId: string) {
  return useQuery({
    queryKey: ["metrics", "project", projectId],
    queryFn: () => metricsService.getProject(projectId),
    enabled: !!projectId,
  });
}
