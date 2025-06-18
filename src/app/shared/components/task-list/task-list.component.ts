import { Component, Input } from '@angular/core';
import { TaskComponent } from "../task/task.component";
import { ISubtask, ITask } from '../../../interfaces/itask';
import { TasksService } from '../../../services/tasks.service';
import { inject } from '@angular/core';

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
  @Input() tasks: ITask[] = [];
  @Input() selectedTask: ITask | null = null;
  private projectService = inject(TasksService);

  // Controla el estado expandido/colapsado de las subtareas por id de tarea
  expandedTasks: Record<number, boolean> = {};

  selectTask(task: ITask) {
    this.selectedTask = task;
    this.projectService.setSelectedTask(task); // Actualiza el signal global
  }

  toggleTask(task: ITask) {
    task.is_completed = !task.is_completed;
    if (task.is_completed) {
      // Marcar todas las subtareas como completadas si la tarea se completa
      task.subtasks.forEach(subtask => {
        if (!subtask.is_completed) {
          subtask.is_completed = true;
        }
      });
    }
  }

  toggleSubtask(subtask: ISubtask) {
    subtask.is_completed = !subtask.is_completed;
  }

  toggleExpand(taskId: number) {
    this.expandedTasks[taskId] = !this.expandedTasks[taskId];
  }

  isTaskSelected(task: ITask): boolean {
    return this.selectedTask?.id === task.id;
  }

  formatDueDate(date: string | undefined): string {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  }

  getTaskProgress(task: ITask) {
    const total = task.subtasks.length;
    const completed = task.subtasks.filter(s => s.is_completed).length;
    return { completed, total };
  }
}
