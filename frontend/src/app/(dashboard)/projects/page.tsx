"use client";

import { useState } from "react";
import { Plus, Search, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/use-projects";
import { Project, ProjectStatus } from "@/types/project";

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const { data, isLoading, error } = useProjects({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const filteredProjects = data?.items.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrUpdate = (formData: {
    name: string;
    description?: string;
    client_name?: string;
    status?: ProjectStatus;
    start_date?: string;
    due_date?: string;
  }) => {
    if (editingProject) {
      updateProject.mutate(
        { id: editingProject.id, data: formData },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingProject(null);
          },
        }
      );
    } else {
      createProject.mutate(formData, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleDelete = (project: Project) => {
    setDeletingProject(project);
  };

  const confirmDelete = () => {
    if (deletingProject) {
      deleteProject.mutate(deletingProject.id, {
        onSuccess: () => {
          setDeletingProject(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projetos</h1>
          <p className="text-slate-500">Gerencie seus projetos e tarefas</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar projetos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="completed">Concluídos</SelectItem>
            <SelectItem value="archived">Arquivados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-white p-5 shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-200" />
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 rounded w-32 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-24" />
                </div>
              </div>
              <div className="mt-3 h-4 bg-slate-200 rounded w-full" />
              <div className="mt-4 flex justify-between">
                <div className="h-6 bg-slate-200 rounded w-16" />
                <div className="h-4 bg-slate-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-600">Erro ao carregar projetos. Tente novamente.</p>
        </div>
      ) : filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-white py-12">
          <FolderKanban className="h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-medium text-slate-900">
            Nenhum projeto encontrado
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery
              ? "Tente ajustar sua busca"
              : "Crie seu primeiro projeto para começar"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setFormOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Criar Projeto
            </Button>
          )}
        </div>
      )}

      {/* Form Dialog */}
      <ProjectFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingProject(null);
        }}
        project={editingProject}
        onSubmit={handleCreateOrUpdate}
        isLoading={createProject.isPending || updateProject.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingProject}
        onOpenChange={(open) => !open && setDeletingProject(null)}
        title="Excluir Projeto"
        description={`Tem certeza que deseja excluir o projeto "${deletingProject?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        onConfirm={confirmDelete}
        isLoading={deleteProject.isPending}
        variant="destructive"
      />
    </div>
  );
}
