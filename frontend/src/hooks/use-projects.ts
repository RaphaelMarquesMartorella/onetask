import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { projectsService } from "@/services/projects";
import { CreateProjectRequest, UpdateProjectRequest } from "@/types/project";

interface UseProjectsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export function useProjects(params?: UseProjectsParams) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => projectsService.list(params),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      toast.success("Projeto criado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar projeto. Tente novamente.");
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      projectsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      toast.success("Projeto atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar projeto. Tente novamente.");
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      toast.success("Projeto excluído com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao excluir projeto. Tente novamente.");
    },
  });
}
