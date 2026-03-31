"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Task, TaskStatus } from "@/types/task";
import { KanbanColumn } from "./kanban-column";

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
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.position - b.position);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get the new status from the destination droppable ID
    const newStatus = destination.droppableId as TaskStatus;
    const taskId = draggableId;

    // Call the move handler
    onTaskMove?.(taskId, newStatus);
  };

  const totalTasks = tasks.length;

  return (
    <div className="h-full flex flex-col">
      {/* Mobile scroll hint */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <p className="text-xs text-slate-500">
          Deslize para ver todas as colunas
        </p>
        <p className="text-xs text-slate-400">
          {totalTasks} tarefa{totalTasks !== 1 ? "s" : ""}
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 flex-1">
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
      </DragDropContext>
    </div>
  );
}
