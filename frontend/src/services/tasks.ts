import { api } from "@/lib/api";
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from "@/types/task";

export const tasksService = {
  getByProject: async (projectId: string): Promise<Task[]> => {
    const response = await api.get<Task[]>("/api/tasks", {
      params: { project_id: projectId },
    });
    return response.data;
  },

  getById: async (taskId: string): Promise<Task> => {
    const response = await api.get<Task>(`/api/tasks/${taskId}`);
    return response.data;
  },

  create: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>("/api/tasks", data);
    return response.data;
  },

  update: async (taskId: string, data: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/api/tasks/${taskId}`, data);
    return response.data;
  },

  updateStatus: async (
    taskId: string,
    data: UpdateTaskStatusRequest
  ): Promise<Task> => {
    const response = await api.patch<Task>(`/api/tasks/${taskId}/status`, data);
    return response.data;
  },

  delete: async (taskId: string): Promise<void> => {
    await api.delete(`/api/tasks/${taskId}`);
  },
};
