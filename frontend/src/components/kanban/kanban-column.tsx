"use client";

import { Droppable } from "@hello-pangea/dnd";
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

const columnConfig: Record<TaskStatus, { borderColor: string; bgHeader: string; bgContent: string }> = {
  todo: {
    borderColor: "border-l-slate-400",
    bgHeader: "from-slate-50 to-white",
    bgContent: "bg-slate-50/50",
  },
  in_progress: {
    borderColor: "border-l-blue-500",
    bgHeader: "from-blue-50 to-white",
    bgContent: "bg-blue-50/30",
  },
  in_review: {
    borderColor: "border-l-amber-500",
    bgHeader: "from-amber-50 to-white",
    bgContent: "bg-amber-50/30",
  },
  done: {
    borderColor: "border-l-green-500",
    bgHeader: "from-green-50 to-white",
    bgContent: "bg-green-50/30",
  },
};

export function KanbanColumn({
  id,
  title,
  tasks,
  onTaskClick,
  onAddTask,
}: KanbanColumnProps) {
  const config = columnConfig[id];

  const getTotalEstimatedHours = () => {
    return tasks.reduce((acc, task) => acc + (Number(task.estimated_hours) || 0), 0);
  };

  const totalHours = Math.round(getTotalEstimatedHours());

  return (
    <div className={cn(
      "flex flex-col w-80 min-w-80 shrink-0 bg-white rounded-xl shadow-md border-l-4",
      config.borderColor
    )}>
      {/* Header */}
      <div className={cn(
        "p-4 border-b border-slate-100 bg-gradient-to-r rounded-t-xl",
        config.bgHeader
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800">{title}</h3>
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-200 text-slate-700">
              {tasks.length}
            </span>
          </div>
          {onAddTask && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-slate-200/50"
              onClick={onAddTask}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {totalHours > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium">{totalHours}h</span>
            <span>estimadas</span>
          </div>
        )}
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-3 overflow-y-auto transition-all duration-200 rounded-b-xl min-h-[250px]",
              config.bgContent,
              snapshot.isDraggingOver && "bg-blue-100/50 ring-2 ring-blue-300 ring-inset"
            )}
          >
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onClick={() => onTaskClick?.(task)}
                />
              ))}
              {provided.placeholder}
            </div>

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-400 mb-2">Nenhuma tarefa</p>
                {onAddTask && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddTask}
                    className="text-xs"
                  >
                    Criar tarefa
                  </Button>
                )}
              </div>
            )}

            {snapshot.isDraggingOver && (
              <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50 text-center text-sm text-blue-600 font-medium mt-3">
                Solte aqui para mover
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
