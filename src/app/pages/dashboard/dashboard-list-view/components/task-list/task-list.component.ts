import { Component, inject, computed } from '@angular/core';
import { TaskComponent } from "../../../../../shared/components/task/task.component";
import { ProjectService } from '../../../../../services/tasks.service';
import { Isubtask, Itask } from '../../../../../interfaces/itask';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TaskComponent
],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  private projectService = inject(ProjectService);
  selectedProject = this.projectService.selectedProject;
  selectedTask = this.projectService.selectedTask;

  // Controla el estado expandido/colapsado de las subtareas por id de tarea
  expandedTasks: Record<number, boolean> = {};

  // Calcula las tareas del proyecto seleccionado (sin crear nuevos objetos)
  tasks = computed(() => {
    const project = this.selectedProject();
    return project ? project.tasks : [];
  });

  selectTask(task: Itask) {
    this.projectService.setSelectedTask(task);
  }

  toggleTask(task: Itask) {
    task.completed = !task.completed;
    if (task.completed) {
      // Marcar todas las subtareas como completadas si la tarea se completa
      task.subtasks.forEach(subtask => {
        if (!subtask.completed) {
          subtask.completed = true;
        }
      });
    }
    // Notificar al service para refrescar el signal y comunicar el cambio a otros componentes
    this.projectService.updateProjects();
  }

  toggleSubtask(subtask: Isubtask) {
    subtask.completed = !subtask.completed;
  }

  toggleExpand(taskId: number) {
    this.expandedTasks[taskId] = !this.expandedTasks[taskId];
  }

  isTaskSelected(task: Itask): boolean {
    return this.selectedTask()?.id === task.id;
  }

  formatDueDate(date: Date | undefined): string {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  }

  getTaskProgress(task: Itask) {
    const total = task.subtasks.length;
    const completed = task.subtasks.filter(s => s.completed).length;
    return { completed, total };
  }
}