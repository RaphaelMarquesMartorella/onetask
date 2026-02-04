"use client";

import { TasksByPriority } from "@/types/metrics";

interface PriorityChartProps {
  tasksByPriority: TasksByPriority;
}

const priorityConfig = [
  { key: "high", label: "Alta", color: "bg-red-500" },
  { key: "medium", label: "Média", color: "bg-yellow-500" },
  { key: "low", label: "Baixa", color: "bg-green-500" },
] as const;

export function PriorityChart({ tasksByPriority }: PriorityChartProps) {
  const total = tasksByPriority.high + tasksByPriority.medium + tasksByPriority.low;
  const maxCount = Math.max(tasksByPriority.high, tasksByPriority.medium, tasksByPriority.low, 1);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-sm font-medium text-slate-900">Tarefas por Prioridade</h3>

      <div className="mt-4 space-y-3">
        {priorityConfig.map(({ key, label, color }) => {
          const count = tasksByPriority[key];
          const percentage = (count / maxCount) * 100;
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{label}</span>
                <span className="font-medium text-slate-900">{count}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500">Total: {total} tarefas</p>
      </div>
    </div>
  );
}
