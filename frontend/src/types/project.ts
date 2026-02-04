import { Task } from "./task";

export type ProjectStatus = "active" | "completed" | "archived";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  client_name: string | null;
  status: ProjectStatus;
  start_date: string | null;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDetail extends Project {
  tasks: Task[];
}

export interface ProjectListResponse {
  items: Project[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  client_name?: string;
  start_date?: string;
  due_date?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  client_name?: string;
  status?: ProjectStatus;
  start_date?: string;
  due_date?: string;
}
