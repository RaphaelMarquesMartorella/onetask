"use client";

import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useDashboardMetrics } from "@/hooks/use-metrics";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TasksOverview } from "@/components/dashboard/tasks-overview";
import { PriorityChart } from "@/components/dashboard/priority-chart";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: metrics, isLoading, error } = useDashboardMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Bem-vindo de volta, {user?.name}!</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-white p-6 shadow-sm animate-pulse"
            >
              <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
              <div className="h-8 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-600">Erro ao carregar métricas. Tente novamente.</p>
        </div>
      ) : metrics ? (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total de Projetos"
              value={metrics.total_projects}
              icon={FolderKanban}
              description={`${metrics.active_projects} ativo${metrics.active_projects !== 1 ? "s" : ""}`}
            />
            <StatsCard
              title="Total de Tarefas"
              value={metrics.total_tasks}
              icon={ListTodo}
              description={`${metrics.my_tasks_count} atribuída${metrics.my_tasks_count !== 1 ? "s" : ""} a você`}
            />
            <StatsCard
              title="Tarefas Concluídas"
              value={metrics.tasks_by_status.done}
              icon={CheckCircle2}
            />
            <StatsCard
              title="Tarefas Atrasadas"
              value={metrics.overdue_tasks}
              icon={AlertCircle}
              className={metrics.overdue_tasks > 0 ? "border-red-200" : ""}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <TasksOverview
              tasksByStatus={metrics.tasks_by_status}
              totalTasks={metrics.total_tasks}
            />
            <PriorityChart tasksByPriority={metrics.tasks_by_priority} />
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Em Progresso</p>
                  <p className="text-xl font-bold text-slate-900">
                    {metrics.tasks_by_status.in_progress}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Em Revisão</p>
                  <p className="text-xl font-bold text-slate-900">
                    {metrics.tasks_by_status.in_review}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Minhas Tarefas</p>
                  <p className="text-xl font-bold text-slate-900">
                    {metrics.my_tasks_count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
