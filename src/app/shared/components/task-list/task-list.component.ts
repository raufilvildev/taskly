import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskComponent } from "../task/task.component";
import { ISubtask, ITask } from '../../../interfaces/itask';
import { TasksService } from '../../../services/tasks.service';
import { inject } from '@angular/core';
import { TaskFormComponent } from '../task-form/task-form.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TaskComponent,
    TaskFormComponent,
    MatIconModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  @Input() tasks: ITask[] = [];
  @Input() selectedTask: ITask | null = null;
  @Input() isCourse: boolean = false;
  @Input() isTeacher: boolean = false;
  @Input() selectedFilter: string | null = null;
  @Input() showBackButton: boolean = false;
  @Output() back = new EventEmitter<void>();
  @Output() selectTaskMobile = new EventEmitter<void>();
  private projectService = inject(TasksService);

  showTaskFormModal = false;

  // Controla el estado expandido/colapsado de las subtareas por id de tarea
  expandedTasks: Record<number, boolean> = {};

  openTaskFormModal() {
    this.showTaskFormModal = true;
  }

  closeTaskFormModal() {
    this.showTaskFormModal = false;
  }

  selectTask(task: ITask) {
    this.selectedTask = task;
    this.projectService.setSelectedTask(task); // Actualiza el signal global
    this.selectTaskMobile.emit();
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
