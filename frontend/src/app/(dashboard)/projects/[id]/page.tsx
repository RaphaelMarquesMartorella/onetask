"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  Edit,
  MoreVertical,
  Trash2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { QuickTaskForm } from "@/components/kanban/quick-task-form";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useProject, useUpdateProject, useDeleteProject } from "@/hooks/use-projects";
import {
  useProjectTasks,
  useCreateTask,
  useUpdateTaskStatus,
} from "@/hooks/use-tasks";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { ProjectStatus } from "@/types/project";
import { cn } from "@/lib/utils";

const statusConfig = {
  active: { label: "Ativo", className: "bg-green-100 text-green-700" },
  completed: { label: "Concluído", className: "bg-blue-100 text-blue-700" },
  archived: { label: "Arquivado", className: "bg-slate-100 text-slate-700" },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: tasks = [], isLoading: tasksLoading } = useProjectTasks(projectId);

  const createTask = useCreateTask();
  const updateTaskStatus = useUpdateTaskStatus();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const handleCreateTask = (data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    due_date?: string;
    estimated_hours?: number;
  }) => {
    createTask.mutate(
      {
        project_id: projectId,
        ...data,
      },
      {
        onSuccess: () => {
          setTaskFormOpen(false);
        },
      }
    );
  };

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus.mutate({
      taskId,
      projectId,
      data: { status: newStatus },
    });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    // Will open task detail modal in next commit
  };

  const handleUpdateProject = (data: {
    name: string;
    description?: string;
    client_name?: string;
    status?: ProjectStatus;
    start_date?: string;
    due_date?: string;
  }) => {
    updateProject.mutate(
      { id: projectId, data },
      {
        onSuccess: () => {
          setEditProjectOpen(false);
        },
      }
    );
  };

  const handleDeleteProject = () => {
    deleteProject.mutate(projectId, {
      onSuccess: () => {
        router.push("/projects");
      },
    });
  };

  if (projectLoading || tasksLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded bg-slate-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-72 h-64 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900">
          Projeto não encontrado
        </h2>
        <p className="text-slate-500 mt-2">
          O projeto que você está procurando não existe ou foi excluído.
        </p>
        <Link href="/projects">
          <Button className="mt-4">Voltar para Projetos</Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[project.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {project.name}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  status.className
                )}
              >
                {status.label}
              </span>
            </div>
            {project.client_name && (
              <p className="text-slate-500 mt-1">{project.client_name}</p>
            )}
            {project.due_date && (
              <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                <Calendar className="h-3.5 w-3.5" />
                Entrega: {format(new Date(project.due_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditProjectOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Projeto
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteProjectOpen(true)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Projeto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-slate-600 bg-white rounded-lg p-4 border">
          {project.description}
        </p>
      )}

      {/* Kanban Board */}
      <KanbanBoard
        tasks={tasks}
        onTaskClick={handleTaskClick}
        onAddTask={() => setTaskFormOpen(true)}
        onTaskMove={handleTaskMove}
      />

      {/* Quick Task Form */}
      <QuickTaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        onSubmit={handleCreateTask}
        isLoading={createTask.isPending}
      />

      {/* Edit Project Dialog */}
      <ProjectFormDialog
        open={editProjectOpen}
        onOpenChange={setEditProjectOpen}
        project={project}
        onSubmit={handleUpdateProject}
        isLoading={updateProject.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteProjectOpen}
        onOpenChange={setDeleteProjectOpen}
        title="Excluir Projeto"
        description={`Tem certeza que deseja excluir o projeto "${project.name}"? Todas as tarefas serão excluídas. Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        onConfirm={handleDeleteProject}
        isLoading={deleteProject.isPending}
        variant="destructive"
      />
    </div>
  );
}
