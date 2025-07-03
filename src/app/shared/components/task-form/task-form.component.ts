import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatSelectModule } from '@angular/material/select';
import { UsersService } from '../../../services/users.service';
import { ITask, ISubtask } from '../../../interfaces/itask.interface';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
export class TaskFormComponent {
  private snackBar = inject(MatSnackBar);
  private usersService = inject(UsersService);

  @Input() showBackButton: boolean = false;
  @Input() isCourseRelated: boolean = false;
  @Output() back = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() createTask = new EventEmitter<ITask>();

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
    is_completed: new FormControl(false),
    subtasks: new FormArray([]),
  });

  closeForm() {
    console.log('Cerrando formulario');
    this.close.emit();
  }

  showSuccessMessage() {
    this.snackBar.open('Tarea creada correctamente', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
    this.close.emit(); // Cerrar el modal después de mostrar la alerta
  }

  onDateChange(event: any) {
    const value = event.value;
    const dueDateControl = this.taskForm.get('due_date');
    dueDateControl?.setValue(value);
    dueDateControl?.markAsTouched();
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

  get subtasks() {
    return this.taskForm.get('subtasks') as FormArray;
  }

  addSubtask() {
    this.subtasks.push(
      new FormGroup({
        title: new FormControl(''),
        is_completed: new FormControl(false),
      })
    );
  }

  removeSubtask(index: number) {
    this.subtasks.removeAt(index);
  }

  onSubmit() {
    console.log('Formulario válido:', this.taskForm.valid);
    console.log('Errores del formulario:', this.taskForm.errors);
    console.log('Estado de los campos:');
    console.log(
      'Title:',
      this.taskForm.get('title')?.value,
      'Válido:',
      this.taskForm.get('title')?.valid
    );
    console.log(
      'Description:',
      this.taskForm.get('description')?.value,
      'Válido:',
      this.taskForm.get('description')?.valid
    );
    console.log(
      'Due date:',
      this.taskForm.get('due_date')?.value,
      'Válido:',
      this.taskForm.get('due_date')?.valid
    );
    console.log('Subtareas válidas:', this.subtasks.valid);
    console.log('Número de subtareas:', this.subtasks.length);
    console.log('Errores de subtareas:', this.subtasks.errors);

    // Verificar cada subtarea individualmente
    for (let i = 0; i < this.subtasks.length; i++) {
      const subtask = this.subtasks.at(i);
      console.log(
        `Subtarea ${i}:`,
        subtask.value,
        'Válida:',
        subtask.valid,
        'Errores:',
        subtask.errors
      );
    }

    if (this.taskForm.valid) {
      const taskData = this.taskForm.value as any;

      // Calcular la hora de fin basada en el tiempo de inicio y estimado
      if (taskData.time_start && taskData.time_estimated) {
        const endTime = this.calculateEndTime();
        if (endTime) {
          taskData.time_end = endTime;
          console.log('Hora de fin calculada:', taskData.time_end);
        }
      }

      // Filtrar subtareas vacías antes de enviar
      if (taskData.subtasks) {
        taskData.subtasks = taskData.subtasks.filter(
          (subtask: any) => subtask.title && subtask.title.trim() !== ''
        );
      }

      console.log('Datos de tarea a enviar:', taskData);
      this.createTask.emit(taskData);
      this.showSuccessMessage(); // Mostrar alerta de éxito
    } else {
      this.taskForm.markAllAsTouched();
    }
  }
}
