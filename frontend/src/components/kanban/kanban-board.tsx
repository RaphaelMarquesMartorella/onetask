"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { Task, TaskStatus } from "@/types/task";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: () => void;
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "A Fazer" },
  { id: "in_progress", title: "Em Progresso" },
  { id: "in_review", title: "Em Revisão" },
  { id: "done", title: "Concluído" },
];

export function KanbanBoard({
  tasks,
  onTaskClick,
  onAddTask,
  onTaskMove,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.position - b.position);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over if needed for visual feedback
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const isColumn = columns.some((col) => col.id === overId);

    if (isColumn) {
      const newStatus = overId as TaskStatus;
      const task = tasks.find((t) => t.id === taskId);

      if (task && task.status !== newStatus) {
        onTaskMove?.(taskId, newStatus);
      }
    } else {
      // Dropped on another task - find that task's status
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        const task = tasks.find((t) => t.id === taskId);
        if (task && task.status !== overTask.status) {
          onTaskMove?.(taskId, overTask.status);
        }
      }
    }
  };

  const totalTasks = tasks.length;

  return (
    <div className="space-y-3">
      {/* Mobile scroll hint */}
      <div className="flex items-center justify-between lg:hidden">
        <p className="text-xs text-slate-500">
          Deslize para ver todas as colunas
        </p>
        <p className="text-xs text-slate-400">
          {totalTasks} tarefa{totalTasks !== 1 ? "s" : ""}
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory lg:snap-none">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              onTaskClick={onTaskClick}
              onAddTask={column.id === "todo" ? onAddTask : undefined}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-3">
              <TaskCard task={activeTask} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
