import { api } from "@/lib/api";
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from "@/types/task";

export const tasksService = {
  getByProject: async (projectId: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
  },

  getById: async (taskId: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${taskId}`);
    return response.data;
  },

  create: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>("/tasks", data);
    return response.data;
  },

  update: async (taskId: string, data: UpdateTaskRequest): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  updateStatus: async (
    taskId: string,
    data: UpdateTaskStatusRequest
  ): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}/status`, data);
    return response.data;
  },

  delete: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};
