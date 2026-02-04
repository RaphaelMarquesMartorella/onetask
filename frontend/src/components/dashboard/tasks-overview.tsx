"use client";

import { TasksByStatus } from "@/types/metrics";

interface TasksOverviewProps {
  tasksByStatus: TasksByStatus;
  totalTasks: number;
}

const statusConfig = [
  { key: "todo", label: "A Fazer", color: "bg-slate-400" },
  { key: "in_progress", label: "Em Progresso", color: "bg-blue-500" },
  { key: "in_review", label: "Em Revisão", color: "bg-yellow-500" },
  { key: "done", label: "Concluído", color: "bg-green-500" },
] as const;

export function TasksOverview({ tasksByStatus, totalTasks }: TasksOverviewProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-sm font-medium text-slate-900">Visão Geral das Tarefas</h3>

      {/* Progress bar */}
      <div className="mt-4 h-3 flex rounded-full overflow-hidden bg-slate-100">
        {totalTasks > 0 ? (
          statusConfig.map(({ key, color }) => {
            const count = tasksByStatus[key];
            const percentage = (count / totalTasks) * 100;
            if (percentage === 0) return null;
            return (
              <div
                key={key}
                className={color}
                style={{ width: `${percentage}%` }}
              />
            );
          })
        ) : (
          <div className="w-full bg-slate-200" />
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {statusConfig.map(({ key, label, color }) => {
          const count = tasksByStatus[key];
          const percentage = totalTasks > 0 ? ((count / totalTasks) * 100).toFixed(0) : 0;
          return (
            <div key={key} className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-600 truncate">{label}</p>
                <p className="text-xs text-slate-400">
                  {count} ({percentage}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
