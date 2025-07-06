import {
  Component,
  inject,
  computed,
  effect,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TasksService } from '../../../services/tasks.service';
import { ISubtask, ITask } from '../../../interfaces/itask.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatSelectModule } from '@angular/material/select';
import { UsersService } from '../../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTimepickerModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
})
export class TaskDetailComponent {
  @Input() isCourse: boolean = false;
  @Input() showBackButton: boolean = false;
  @Output() back = new EventEmitter<void>();
  @Output() saveTask = new EventEmitter<ITask>();
  @Output() deleteTask = new EventEmitter<ITask>();
  @ViewChild('deleteDialogTemplate') deleteDialogTemplate!: TemplateRef<any>;

  private projectService = inject(TasksService);
  public usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  selectedTask = computed(() => this.projectService.selectedTask());
  taskForm: FormGroup;
  private fb = inject(FormBuilder);
  showDeleteModal = false;

  // Lista de horas en intervalos de 15 minutos para el desplegable
  hoursList: string[] = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4)
      .toString()
      .padStart(2, '0');
    const min = ((i % 4) * 15).toString().padStart(2, '0');
    return `${hour}:${min}`;
  });

  // Computed para verificar si el usuario es alumno
  isStudent = computed(() => {
    return this.usersService.currentUser?.role === 'student' || false;
  });

  // Computed para verificar si la tarea es de curso
  isCourseRelatedTask = computed(() => {
    const task = this.selectedTask();
    return (task && task.category === 'course_related') || false;
  });

  // Computed para verificar si se deben aplicar restricciones
  shouldApplyRestrictions = computed(() => {
    // Los estudiantes no pueden editar tareas de curso
    if (this.isStudent() && this.isCourseRelatedTask()) {
      return true;
    }
    // El profesor solo puede editar tareas de curso si está en contexto de curso
    if (this.usersService.currentUser?.role === 'teacher') {
      const task = this.selectedTask();
      if (this.isCourse) {
        // En contexto de curso, solo puede editar tareas de curso
        return !(task && task.category === 'course_related');
      } else {
        // Fuera de curso, solo puede editar custom
        return !(task && task.category === 'custom');
      }
    }
    return false;
  });

  // Computed para verificar si se puede eliminar la tarea
  canDeleteTask = computed(() => {
    const task = this.selectedTask();
    if (!task) return false;
    if (this.usersService.currentUser?.role === 'teacher') {
      if (this.isCourse) {
        // En contexto de curso, solo puede eliminar tareas de curso
        return task.category === 'course_related';
      } else {
        // Fuera de curso, solo puede eliminar custom
        return task.category === 'custom';
      }
    }
    // El alumno solo puede eliminar custom
    return task.category === 'custom';
  });

  // Subtareas como array simple fuera del FormGroup
  subtasks: { uuid?: string; title: string; is_completed: boolean }[] = [];

  constructor() {
    this.taskForm = this.fb.group({
      title: [''],
      description: [''],
      due_date: [null],
      time_start: [''],
      time_estimated: [''],
      is_completed: [false],
      is_urgent: [false],
      is_important: [false],
    });

    // Sincroniza el formulario con la tarea seleccionada
    effect(() => {
      const task = this.selectedTask();
      if (task) {
        this.subtasks = (task.subtasks || []).map((subtask) => ({
          title: subtask.title,
          is_completed: !!subtask.is_completed,
        }));
        let cleanTimeStart = '';
        if (typeof task.time_start === 'string') {
          const parts = task.time_start.split(':');
          if (parts.length >= 2) {
            cleanTimeStart = parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0');
          }
        }
        this.taskForm.patchValue(
          {
            title: task.title,
            description: task.description,
            due_date: task.due_date ? new Date(task.due_date) : null,
            time_start: cleanTimeStart,
            time_estimated: this.calculateTimeEstimated(task.time_start, task.time_end),
            is_completed: task.is_completed,
            is_urgent: task.is_urgent,
            is_important: task.is_important,
          },
          { emitEvent: false }
        );
        this.taskForm.get('time_start')?.setValue(cleanTimeStart, { emitEvent: false });
        this.taskForm.get('time_start')?.updateValueAndValidity();
      }
    });
  }

  // Métodos para subtasks como array simple
  addSubtask() {
    this.subtasks.push({ uuid: '', title: '', is_completed: false });
  }

  removeSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  toggleSubtaskCompleted(index: number) {
    this.subtasks[index].is_completed = !this.subtasks[index].is_completed;
  }

  updateSubtaskTitle(index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.subtasks[index].title = value;
  }

  // Método para calcular el tiempo estimado basado en time_start y time_end
  calculateTimeEstimated(time_start: string, time_end: string): string {
    if (!time_start || !time_end) {
      return '';
    }

    // Convertir tiempos a minutos
    const [startHours, startMinutes] = time_start.split(':').map(Number);
    const [endHours, endMinutes] = time_end.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    // Calcular diferencia en minutos
    const differenceMinutes = endTotalMinutes - startTotalMinutes;

    const options = [15, 30, 45, 60, 90, 120, 150, 180, 240];
    const closestOption = options.reduce((prev, curr) => {
      return Math.abs(curr - differenceMinutes) < Math.abs(prev - differenceMinutes) ? curr : prev;
    });

    return closestOption.toString();
  }

  // Método para enviar actualización al backend
  sendUpdate() {
    const task = this.selectedTask();
    if (!task) return;
    const formValue = this.taskForm.value;

    // Normalizar due_date a formato aaaa-mm-dd
    let due_date = formValue.due_date;
    if (due_date instanceof Date) {
      due_date = `${due_date.getFullYear()}-${(due_date.getMonth() + 1).toString().padStart(2, '0')}-${due_date.getDate().toString().padStart(2, '0')}`;
    } else if (typeof due_date === 'string' && due_date.length > 10) {
      due_date = due_date.split('T')[0];
    }

    // Normalizar time_start a hh:mm:ss
    let time_start = formValue.time_start;
    if (time_start instanceof Date) {
      time_start = `${time_start.getHours().toString().padStart(2, '0')}:${time_start.getMinutes().toString().padStart(2, '0')}:${time_start.getSeconds().toString().padStart(2, '0')}`;
    } else if (typeof time_start === 'string' && /^\d{2}:\d{2}$/.test(time_start)) {
      time_start = time_start + ':00';
    }

    // Calcular time_end a hh:mm:ss
    let time_end = '';
    if (
      typeof time_start === 'string' &&
      /^\d{2}:\d{2}:\d{2}$/.test(time_start) &&
      formValue.time_estimated
    ) {
      const [h, m, s] = time_start.split(':').map(Number);
      const date = new Date();
      date.setHours(h, m, s || 0, 0);
      date.setMinutes(date.getMinutes() + Number(formValue.time_estimated));
      time_end = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }

    // Filtrar subtasks vacías y agregar uuid si existe (uuid vacío para nuevas)
    const subtasks = this.subtasks
      .filter((st) => st.title && st.title.trim() !== '')
      .map((edited, i) => {
        // Buscar uuid original si existe
        let uuid = '';
        if (task.subtasks && task.subtasks[i] && task.subtasks[i].uuid) {
          uuid = task.subtasks[i].uuid;
        } else if (edited.uuid) {
          uuid = edited.uuid;
        }
        // Si es nueva, uuid será ""
        const subtaskObj: any = {
          title: edited.title,
          is_completed: edited.is_completed,
        };
        if (uuid) subtaskObj.uuid = uuid;
        return subtaskObj;
      });
    const updateData = {
      title: formValue.title,
      description: formValue.description,
      due_date,
      time_start,
      time_end,
      is_completed: !!formValue.is_completed,
      is_urgent: !!formValue.is_urgent,
      is_important: !!formValue.is_important,
      subtasks,
      category: task.category,
    };

    const url = `/api/tasks/${task.uuid}`;
    console.log('PUT a:', url, 'con datos:', updateData);

    this.projectService.updateTask(task.uuid, updateData as any).subscribe({
      next: (updated) => {
        console.log('Respuesta del backend (PUT):', updated);
        window.location.reload(); // Recargar la página tras actualizar
      },
      error: (err) => {
        console.error('Error al hacer PUT:', err);
        // Opcional: feedback de error
      },
    });
  }

  toggleCompletion() {
    if (this.selectedTask()) {
      const completed = !this.selectedTask()!.is_completed;
      this.selectedTask()!.is_completed = completed;
      // Marcar/desmarcar todas las subtareas también
      if (this.selectedTask()!.subtasks) {
        this.selectedTask()!.subtasks.forEach((subtask) => (subtask.is_completed = completed));
      }
      this.taskForm.patchValue({ is_completed: completed }, { emitEvent: false });
      this.sendUpdate();
    }
  }

  toggleSubtask(subtask: ISubtask) {
    subtask.is_completed = !subtask.is_completed;
    // this.sendUpdate(); // Comentado: solo guardar al marcar completado general o guardar manual
  }

  // Maneja el cambio del input nativo de fecha
  onNativeDateChange(event: any) {
    const value = event.target.value;
    this.taskForm.get('due_date')?.setValue(value ? value : null);
  }

  // Maneja el cambio del date-picker de Angular Material
  onDateChange(event: any) {
    const value = event.value;
    this.taskForm.get('due_date')?.setValue(value);
    // this.sendUpdate(); // Comentado: solo guardar al marcar completado general o guardar manual
  }

  onTimeStartChange() {
    // this.sendUpdate(); // Comentado: solo guardar al marcar completado general o guardar manual
  }

  onTimeEstimatedChange() {
    // this.sendUpdate(); // Comentado: solo guardar al marcar completado general o guardar manual
  }

  clearSelectedTask(): void {
    this.projectService.setSelectedTask(null);
  }

  openDeleteConfirmation() {
    this.showDeleteModal = true;
  }

  closeDeleteDialog() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    console.log('confirmDelete llamado');
    this.performDeleteTask();
    // El modal se cerrará automáticamente en el callback de éxito
  }

  performDeleteTask() {
    const task = this.selectedTask();
    if (task) {
      this.projectService.deleteTask(task.uuid).subscribe({
        next: () => {
          this.deleteTask.emit(task);
          this.closeDeleteDialog();
          this.clearSelectedTask();
          // Recargar la página tras eliminar
          window.location.reload();
        },
        error: (error) => {
          console.error('Error al eliminar la tarea:', error);
        },
      });
    } else {
      console.log('No hay tarea seleccionada para eliminar');
    }
  }

  saveChanges() {
    const task = this.selectedTask();
    if (task) {
      if (this.taskForm.valid) {
        this.saveTask.emit(task);
        this.sendUpdate();
      } else {
        this.taskForm.markAllAsTouched();
        console.warn('El formulario no es válido, revisa los campos obligatorios.');
      }
    }
  }

  get dueDateControl(): FormControl {
    return this.taskForm.get('due_date') as FormControl;
  }
  get timeStartControl(): FormControl {
    return this.taskForm.get('time_start') as FormControl;
  }
  get timeEstimatedControl(): FormControl {
    return this.taskForm.get('time_estimated') as FormControl;
  }

  private readonly durationMap: Record<number, string> = {
    15: '15 min',
    30: '30 min',
    45: '45 min',
    60: '1 hora',
    90: '1 hora 30',
    120: '2 horas',
    150: '2 horas 30',
    180: '3 horas',
    240: '4 horas',
  };

  getDurationText(minutes: string | number): string {
    if (!minutes) return '';

    const mins = Number(minutes);
    return this.durationMap[mins] || `${mins} min`;
  }

  saveSubtask(index: number) {
    // this.sendUpdate(); // Comentado: solo guardar al marcar completado general o guardar manual
  }
}
