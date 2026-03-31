"use client";

import { Draggable } from "@hello-pangea/dnd";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  index: number;
  onClick?: () => void;
}

const priorityConfig = {
  high: {
    label: "Alta",
    className: "bg-red-500 text-white border-red-600",
    icon: true,
  },
  medium: {
    label: "Média",
    className: "bg-amber-100 text-amber-800 border-amber-300",
    icon: false,
  },
  low: {
    label: "Baixa",
    className: "bg-green-100 text-green-800 border-green-300",
    icon: false,
  },
};

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "relative bg-white p-4 rounded-lg border-2 cursor-grab active:cursor-grabbing group transition-all duration-200",
            snapshot.isDragging
              ? "shadow-2xl border-blue-500 opacity-95 rotate-1 scale-105"
              : "shadow-sm hover:shadow-lg border-slate-200 hover:border-blue-300",
            isOverdue && !snapshot.isDragging && "border-red-300"
          )}
          onClick={onClick}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors">
              {task.title}
            </h4>
            <span
              className={cn(
                "flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded border flex items-center gap-1",
                priority.className
              )}
            >
              {priority.icon && <AlertCircle className="w-3 h-3" />}
              {priority.label}
            </span>
          </div>

          {/* Card Description */}
          {task.description && (
            <p className="text-xs text-slate-500 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Card Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3 text-xs">
              {task.due_date && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    isOverdue ? "text-red-600 font-medium" : "text-slate-500"
                  )}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(task.due_date), "dd MMM", { locale: ptBR })}
                </span>
              )}

              {task.estimated_hours && (
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  {Math.round(Number(task.estimated_hours))}h
                </span>
              )}
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 rounded-lg bg-blue-500 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none" />
        </div>
      )}
    </Draggable>
  );
}
