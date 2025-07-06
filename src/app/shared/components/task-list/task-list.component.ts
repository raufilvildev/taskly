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
    const nuevoEstado = !task.is_completed;
    task.is_completed = nuevoEstado;
    if (nuevoEstado) {
      task.subtasks.forEach(subtask => {
        if (!subtask.is_completed) {
          subtask.is_completed = true;
        }
      });
    }
    // Sincronizar el objeto global para que task-detail y task-list estén siempre actualizados
    this.projectService.setSelectedTask({ ...task });
    // Enviar el PUT con todos los datos, pero usando el tipo correcto para subtasks
    const updateData: Partial<ITask> = {
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      time_start: task.time_start,
      time_end: task.time_end,
      is_completed: task.is_completed,
      is_urgent: task.is_urgent,
      is_important: task.is_important,
      subtasks: task.subtasks, // Enviamos el array completo, aunque el backend solo use uuid, title, is_completed
      category: task.category
    };
    this.projectService.updateTask(task.uuid, updateData).subscribe({
      next: () => {
        this.snackBar.open(
          task.is_completed ? 'Tarea marcada como completada' : 'Tarea marcada como pendiente',
          'Cerrar',
          {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          }
        );
      },
      error: () => {
        this.snackBar.open('No se pudo actualizar la tarea', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        task.is_completed = !nuevoEstado;
        this.projectService.setSelectedTask({ ...task });
      }
    });
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

  onCreateTask(event: { task: any, course_uuid?: string }) {
    const { task, course_uuid } = event;
    if (this.isCourse) {
      task.category = 'course_related';
    } else {
      task.category = 'custom';
    }
    const isValidCourseUuid = course_uuid && course_uuid !== 'tasks' && course_uuid !== '';
    if (isValidCourseUuid) {
      this.projectService.createTaskByProf(course_uuid!, task).subscribe({
        next: (newTask) => {
          this.closeTaskFormModal();
          this.showTaskFormModal = false;
        },
        error: (error) => {
          this.snackBar.open('No hemos podido registrar su tarea', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.projectService.createTask(task).subscribe({
        next: (newTask) => {
          this.closeTaskFormModal();
          this.showTaskFormModal = false;
        },
        error: (error) => {
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
}
