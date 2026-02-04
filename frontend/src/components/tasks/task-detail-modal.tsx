"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Trash2,
  X,
} from "lucide-react";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "in_review", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z.string().optional(),
  estimated_hours: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onUpdate: (data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string;
    estimated_hours?: number;
  }) => void;
  onDelete: () => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

const statusConfig = {
  todo: { label: "A Fazer", color: "bg-slate-500" },
  in_progress: { label: "Em Progresso", color: "bg-blue-500" },
  in_review: { label: "Em Revisão", color: "bg-yellow-500" },
  done: { label: "Concluído", color: "bg-green-500" },
};

const priorityConfig = {
  high: { label: "Alta", className: "bg-red-100 text-red-700" },
  medium: { label: "Média", className: "bg-yellow-100 text-yellow-700" },
  low: { label: "Baixa", className: "bg-green-100 text-green-700" },
};

export function TaskDetailModal({
  open,
  onOpenChange,
  task,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: TaskDetailModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const status = watch("status");
  const priority = watch("priority");

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        due_date: task.due_date
          ? format(new Date(task.due_date), "yyyy-MM-dd")
          : "",
        estimated_hours: task.estimated_hours?.toString() || "",
      });
    }
  }, [task, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    onUpdate({
      title: data.title,
      description: data.description || undefined,
      status: data.status,
      priority: data.priority,
      due_date: data.due_date || undefined,
      estimated_hours: data.estimated_hours
        ? parseFloat(data.estimated_hours)
        : undefined,
    });
  };

  if (!task) return null;

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-lg">Detalhes da Tarefa</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Título da tarefa"
              className="text-base font-medium"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value: TaskStatus) => setValue("status", value, { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full",
                          statusConfig[status]?.color
                        )}
                      />
                      {statusConfig[status]?.label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2.5 h-2.5 rounded-full", config.color)} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={priority}
                onValueChange={(value: TaskPriority) => setValue("priority", value, { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue>
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded text-xs font-medium",
                        priorityConfig[priority]?.className
                      )}
                    >
                      {priorityConfig[priority]?.label}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <span
                        className={cn(
                          "inline-flex px-2 py-0.5 rounded text-xs font-medium",
                          config.className
                        )}
                      >
                        {config.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Adicione uma descrição para a tarefa..."
              rows={4}
            />
          </div>

          {/* Due Date and Estimated Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                Data de Entrega
              </Label>
              <Input
                id="due_date"
                type="date"
                {...register("due_date")}
                className={cn(isOverdue && "border-red-300 text-red-600")}
              />
              {isOverdue && (
                <p className="text-xs text-red-500">Tarefa atrasada</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_hours" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                Horas Estimadas
              </Label>
              <Input
                id="estimated_hours"
                type="number"
                step="0.5"
                min="0"
                {...register("estimated_hours")}
                placeholder="Ex: 4"
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
              <div>
                <p>Criado em</p>
                <p className="font-medium text-slate-700">
                  {format(new Date(task.created_at), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div>
                <p>Atualizado em</p>
                <p className="font-medium text-slate-700">
                  {format(new Date(task.updated_at), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating || !isDirty}>
              {isUpdating ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
