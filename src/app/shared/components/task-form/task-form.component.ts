import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatSelectModule } from '@angular/material/select';
import { UsersService } from '../../../services/users.service';
import { CoursesService } from '../../../services/courses.service';
import { ITask, ISubtask } from '../../../interfaces/itask.interface';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTimepickerModule,
    MatSelectModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private usersService = inject(UsersService);
  private coursesService = inject(CoursesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @Input() showBackButton: boolean = false;
  @Input() isCourseRelated: boolean = false;
  @Input() course_uuid?: string;
  @Output() back = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() createTask = new EventEmitter<{ task: any, course_uuid?: string }>();

  course_id?: number;
  course_uuid_final?: string;

  // Computed para verificar si el usuario es alumno
  get isStudent(): boolean {
    return this.usersService.currentUser.role === 'student';
  }

  // Computed para verificar si se deben aplicar restricciones
  get shouldApplyRestrictions(): boolean {
    return this.isStudent && this.isCourseRelated;
  }

  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    due_date: new FormControl('', [Validators.required]),
    time_start: new FormControl(''),
    time_estimated: new FormControl(''),
    is_urgent: new FormControl(false),
    is_important: new FormControl(false),
  });

  // Array simple para las subtareas
  subtasks: string[] = [];

  ngOnInit() {
    let uuid = this.course_uuid;
    if (!uuid) {
      const urlSegments = this.router.url.split('/').filter(Boolean);
      uuid = urlSegments[urlSegments.length - 1];
    }
    if (uuid) {
      this.course_uuid_final = uuid;
    }
  }

  closeForm() {
    this.close.emit();
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  showSuccessMessage() {
    this.snackBar.open('Tarea creada correctamente', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
    this.closeForm(); // Usar closeForm para cerrar y recargar
  }

  /**
   * Calcula la hora de finalización basada en la hora de inicio y la duración estimada
   * @returns string en formato HH:mm o null si los datos son inválidos
   */
  calculateEndTime(): string | null {
    const timeStart = this.taskForm.get('time_start')?.value;
    const timeEstimated = this.taskForm.get('time_estimated')?.value;

    if (
      !timeStart ||
      !timeEstimated ||
      !/^\d{2}:\d{2}$/.test(timeStart) ||
      isNaN(Number(timeEstimated))
    ) {
      return null;
    }

    try {
      // Crear una fecha base para los cálculos
      const today = new Date();
      const [startHours, startMinutes] = timeStart.split(':').map(Number);

      // Validar el formato de hora
      if (startHours < 0 || startHours > 23 || startMinutes < 0 || startMinutes > 59) {
        return null;
      }

      // Convertir tiempo estimado de minutos a milisegundos
      const estimatedMs = Number(timeEstimated) * 60 * 1000;

      // Crear fecha con la hora de inicio
      const startDate = new Date(today.setHours(startHours, startMinutes, 0, 0));

      // Calcular hora de fin
      const endDate = new Date(startDate.getTime() + estimatedMs);

      // Formatear la hora de salida
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

      return `${endHours}:${endMinutes}`;
    } catch (error) {
      console.error('Error calculando la hora de fin:', error);
      return null;
    }
  }

  addSubtask() {
    this.subtasks.push('');
  }

  removeSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  onSubtaskBlur(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();

    if (value === '') {
      this.subtasks.splice(index, 1);
    } else {
      this.subtasks[index] = value;
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value as any;

      if (taskData.due_date instanceof Date) {
        taskData.due_date = `${taskData.due_date.getFullYear()}-${(taskData.due_date.getMonth() + 1).toString().padStart(2, '0')}-${taskData.due_date.getDate().toString().padStart(2, '0')}`;
      } else if (typeof taskData.due_date === 'string' && taskData.due_date.length > 10) {
        taskData.due_date = taskData.due_date.split('T')[0];
      }

      if (taskData.time_start instanceof Date) {
        taskData.time_start = `${taskData.time_start.getHours().toString().padStart(2, '0')}:${taskData.time_start.getMinutes().toString().padStart(2, '0')}:${taskData.time_start.getSeconds().toString().padStart(2, '0')}`;
      } else if (typeof taskData.time_start === 'string' && /^\d{2}:\d{2}$/.test(taskData.time_start)) {
        taskData.time_start = taskData.time_start + ':00';
      }

      if (
        typeof taskData.time_start === 'string' &&
        /^\d{2}:\d{2}:\d{2}$/.test(taskData.time_start) &&
        taskData.time_estimated
      ) {
        const [h, m, s] = taskData.time_start.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m, s || 0, 0);
        date.setMinutes(date.getMinutes() + Number(taskData.time_estimated));
        taskData.time_end = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        delete taskData.time_estimated;
      }

      taskData.subtasks = this.subtasks.filter(subtask => subtask && subtask.trim() !== '');
      if (this.course_uuid_final) {
        this.createTask.emit({ task: taskData, course_uuid: this.course_uuid_final });
      } else {
        this.createTask.emit({ task: taskData });
      }
      this.showSuccessMessage();
    } else {
      this.taskForm.markAllAsTouched();
    }
  }
}
