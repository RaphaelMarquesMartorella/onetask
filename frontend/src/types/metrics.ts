export interface TasksByStatus {
  todo: number;
  in_progress: number;
  in_review: number;
  done: number;
}

export interface TasksByPriority {
  low: number;
  medium: number;
  high: number;
}

export interface DashboardMetrics {
  total_projects: number;
  active_projects: number;
  total_tasks: number;
  tasks_by_status: TasksByStatus;
  tasks_by_priority: TasksByPriority;
  overdue_tasks: number;
  my_tasks_count: number;
}

export interface TasksByAssignee {
  user_id: string;
  user_name: string;
  count: number;
}

export interface ProjectMetrics {
  total_tasks: number;
  completed_tasks: number;
  completion_percentage: number;
  tasks_by_status: TasksByStatus;
  tasks_by_assignee: TasksByAssignee[];
}
