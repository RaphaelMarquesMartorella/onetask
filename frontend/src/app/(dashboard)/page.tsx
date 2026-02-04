"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard (Temporário)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              Bem-vindo, <strong>{user?.name}</strong>!
            </p>
            <p className="text-slate-500 text-sm">
              Email: {user?.email}
            </p>
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
