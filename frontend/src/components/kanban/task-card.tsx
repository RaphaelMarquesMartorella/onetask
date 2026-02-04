"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, GripVertical } from "lucide-react";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityConfig = {
  high: { label: "Alta", className: "bg-red-100 text-red-700 border-red-200" },
  medium: { label: "Média", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  low: { label: "Baixa", className: "bg-green-100 text-green-700 border-green-200" },
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[task.priority];
  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-lg border bg-white p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow",
        isDragging && "opacity-50 shadow-lg",
        isOverdue && "border-red-300"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1 -ml-1 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4 text-slate-400" />
        </button>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 text-sm line-clamp-2">
            {task.title}
          </h4>

          {task.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                priority.className
              )}
            >
              {priority.label}
            </span>

            {task.due_date && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs",
                  isOverdue ? "text-red-600" : "text-slate-500"
                )}
              >
                <Calendar className="h-3 w-3" />
                {format(new Date(task.due_date), "dd MMM", { locale: ptBR })}
              </span>
            )}

            {task.estimated_hours && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {task.estimated_hours}h
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
