import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { TaskComponent } from "../task/task.component";
import { ISubtask, ITask } from '../../../interfaces/itask.interface';
import { TasksService } from '../../../services/tasks.service';
import { inject } from '@angular/core';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TaskComponent,
    TaskFormComponent,
    TaskFilterComponent,
    MatIconModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  @Input() tasks: ITask[] = [];
  @Input() isCourse: boolean = false;
  @Input() isTeacher: boolean = false;
  @Input() selectedFilter: string | null = null;
  @Input() showBackButton: boolean = false;
  @Output() back = new EventEmitter<void>();
  @Output() selectTaskMobile = new EventEmitter<void>();
  @Output() filterChange = new EventEmitter<{ categoryFilters: string[]; showCompleted: boolean; showPending: boolean }>();
  private projectService = inject(TasksService);
  private snackBar = inject(MatSnackBar);

  showTaskFormModal = false;

  // Controla el estado expandido/colapsado de las subtareas por id de tarea
  expandedTasks: Record<number, boolean> = {};

  // Host binding para la clase modal-open
  @HostBinding('class.modal-open') get isModalOpen() {
    return this.showTaskFormModal;
  }

  openTaskFormModal() {
    this.showTaskFormModal = true;
  }

  closeTaskFormModal() {
    this.showTaskFormModal = false;
  }

  selectTask(task: ITask) {
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
    const selectedTask = this.projectService.selectedTask();
    return selectedTask?.id === task.id;
  }

  formatDueDate(date: string | undefined): string {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  }

  onFilterChange(filters: { categoryFilters: string[]; showCompleted: boolean; showPending: boolean }) {
    this.filterChange.emit(filters);
  }

  onCreateTask(taskData: any) {
    // Asignar la categoría según el contexto
    if (this.isCourse) {
      taskData.category = 'course_related';
    } else {
      taskData.category = 'custom';
    }
    // Crear la tarea usando el servicio
    this.projectService.createTask(taskData).subscribe({
      next: (newTask) => {
        console.log('Tarea creada exitosamente:', newTask);
        this.closeTaskFormModal();
        // Resetear el formulario
        this.showTaskFormModal = false;
      },
      error: (error) => {
        console.error('Error al crear la tarea:', error);
        this.snackBar.open('No hemos podido registrar su tarea', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
