import { api } from "@/lib/api";
import {
  Project,
  ProjectDetail,
  ProjectListResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/types/project";

interface ListProjectsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const projectsService = {
  list: async (params?: ListProjectsParams): Promise<ProjectListResponse> => {
    const response = await api.get<ProjectListResponse>("/api/projects", { params });
    return response.data;
  },

  getById: async (id: string): Promise<ProjectDetail> => {
    const response = await api.get<ProjectDetail>(`/api/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await api.post<Project>("/api/projects", data);
    return response.data;
  },

  update: async (id: string, data: UpdateProjectRequest): Promise<Project> => {
    const response = await api.put<Project>(`/api/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/projects/${id}`);
  },
};
