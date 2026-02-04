"use client";

import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">
          Bem-vindo de volta, {user?.name}!
        </p>
      </div>

      {/* Placeholder para métricas - será implementado no próximo commit */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total de Projetos</p>
          <p className="text-2xl font-bold">-</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tarefas Pendentes</p>
          <p className="text-2xl font-bold">-</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Em Progresso</p>
          <p className="text-2xl font-bold">-</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Concluídas</p>
          <p className="text-2xl font-bold">-</p>
        </div>
      </div>
    </div>
  );
}
