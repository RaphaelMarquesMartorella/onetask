"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./task-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: () => void;
}

const columnConfig: Record<TaskStatus, { color: string; bgColor: string }> = {
  todo: { color: "bg-slate-500", bgColor: "bg-slate-50" },
  in_progress: { color: "bg-blue-500", bgColor: "bg-blue-50" },
  in_review: { color: "bg-yellow-500", bgColor: "bg-yellow-50" },
  done: { color: "bg-green-500", bgColor: "bg-green-50" },
};

export function KanbanColumn({
  id,
  title,
  tasks,
  onTaskClick,
  onAddTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = columnConfig[id];

  return (
    <div className="flex flex-col w-72 min-w-72 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", config.color)} />
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        {id === "todo" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onAddTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-lg p-2 min-h-[200px] transition-colors",
          config.bgColor,
          isOver && "ring-2 ring-blue-400 ring-offset-2"
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick?.(task)}
              />
            ))}
          </div>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 text-sm text-slate-400">
            Nenhuma tarefa
          </div>
        )}
      </div>
    </div>
  );
}
