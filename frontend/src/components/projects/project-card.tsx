"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MoreVertical, Trash2, Edit, FolderKanban } from "lucide-react";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

const statusConfig = {
  active: { label: "Ativo", className: "bg-green-100 text-green-700" },
  completed: { label: "Concluído", className: "bg-blue-100 text-blue-700" },
  archived: { label: "Arquivado", className: "bg-slate-100 text-slate-700" },
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const status = statusConfig[project.status];

  return (
    <div className="group rounded-lg border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <Link
          href={`/projects/${project.id}`}
          className="flex-1 min-w-0"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
              <FolderKanban className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {project.name}
              </h3>
              {project.client_name && (
                <p className="text-sm text-slate-500 truncate">
                  {project.client_name}
                </p>
              )}
            </div>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(project)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(project)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {project.description && (
        <p className="mt-3 text-sm text-slate-600 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            status.className
          )}
        >
          {status.label}
        </span>

        {project.due_date && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {format(new Date(project.due_date), "dd MMM yyyy", { locale: ptBR })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
