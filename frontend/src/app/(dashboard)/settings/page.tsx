"use client";

import { useState } from "react";
import { User, Bell, Shield, Palette } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "security", label: "Segurança", icon: Shield },
  { id: "appearance", label: "Aparência", icon: Palette },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-500">Gerencie suas preferências e conta</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:w-48 pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg border p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Informações do Perfil
                </h2>
                <p className="text-sm text-slate-500">
                  Atualize suas informações pessoais
                </p>
              </div>

              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    defaultValue={user?.name}
                    placeholder="Seu nome"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email}
                    disabled
                    className="bg-slate-50"
                  />
                  <p className="text-xs text-slate-500">
                    O email não pode ser alterado
                  </p>
                </div>

                <Button className="w-fit">Salvar Alterações</Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Notificações
                </h2>
                <p className="text-sm text-slate-500">
                  Configure como você recebe notificações
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-slate-900">
                      Notificações por email
                    </p>
                    <p className="text-sm text-slate-500">
                      Receba atualizações sobre suas tarefas
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Em breve
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-slate-900">
                      Lembretes de prazo
                    </p>
                    <p className="text-sm text-slate-500">
                      Seja notificado sobre tarefas próximas do prazo
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Em breve
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Segurança
                </h2>
                <p className="text-sm text-slate-500">
                  Gerencie a segurança da sua conta
                </p>
              </div>

              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                <Button className="w-fit">Alterar Senha</Button>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Aparência
                </h2>
                <p className="text-sm text-slate-500">
                  Personalize a aparência do aplicativo
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-slate-900 mb-3">Tema</p>
                  <div className="flex gap-3">
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-blue-500 bg-blue-50">
                      <div className="w-16 h-10 rounded bg-white border shadow-sm" />
                      <span className="text-sm font-medium">Claro</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-slate-300">
                      <div className="w-16 h-10 rounded bg-slate-800 border shadow-sm" />
                      <span className="text-sm text-slate-500">Escuro</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-slate-300">
                      <div className="w-16 h-10 rounded bg-gradient-to-r from-white to-slate-800 border shadow-sm" />
                      <span className="text-sm text-slate-500">Sistema</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Modo escuro em breve
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
