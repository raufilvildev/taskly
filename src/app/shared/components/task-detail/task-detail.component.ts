import { Component, inject, computed, effect, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { TasksService } from '../../../services/tasks.service';
import { ISubtask, ITask } from '../../../interfaces/itask';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatSelectModule } from '@angular/material/select';
import { UsersService } from '../../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent {
  @Input() isCourse: boolean = false;
  @Input() showBackButton: boolean = false;
  @Output() back = new EventEmitter<void>();
  @Output() saveTask = new EventEmitter<ITask>();
  @Output() deleteTask = new EventEmitter<ITask>();
  @ViewChild('deleteDialogTemplate') deleteDialogTemplate!: TemplateRef<any>;
  
  private projectService = inject(TasksService);
  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  selectedTask = computed(() => this.projectService.selectedTask());
  taskForm: FormGroup;
  private fb = inject(FormBuilder);
  showDeleteModal = false;

  // Lista de horas en intervalos de 15 minutos para el desplegable
  hoursList: string[] = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4).toString().padStart(2, '0');
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
    // Los profesores solo pueden editar tareas si están en contexto de curso
    if (this.usersService.currentUser?.role === 'teacher' && !this.isCourse) {
      return true;
    }
    return false;
  });

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
      subtasks: this.fb.array([])
    });

    // Sincroniza el formulario con la tarea seleccionada
    effect(() => {
      const task = this.selectedTask();
      if (task) {
        // Limpiar el FormArray de subtareas
        const subtasksArray = this.taskForm.get('subtasks') as FormArray;
        subtasksArray.clear();
        
        // Agregar las subtareas existentes al FormArray
        if (task.subtasks) {
          task.subtasks.forEach(subtask => {
            subtasksArray.push(this.fb.group({
              title: [subtask.title],
              is_completed: [subtask.is_completed]
            }));
          });
        }
        
        let cleanTimeStart = '';
        if (typeof task.time_start === 'string') {
          const parts = task.time_start.split(':');
          if (parts.length >= 2) {
            cleanTimeStart = parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0');
          }
        }
        // Forzar el valor también directamente en el control, además de patchValue
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          due_date: task.due_date ? new Date(task.due_date) : null,
          time_start: cleanTimeStart,
          time_estimated: this.calculateTimeEstimated(task.time_start, task.time_end),
          is_completed: task.is_completed,
          is_urgent: task.is_urgent,
          is_important: task.is_important
        }, { emitEvent: false });
        this.taskForm.get('time_start')?.setValue(cleanTimeStart, { emitEvent: false });
        this.taskForm.get('time_start')?.updateValueAndValidity();
        console.log('Valor recibido en time_start:', task.time_start, 'Valor limpio:', cleanTimeStart);
      }
    });

    // Actualiza la tarea seleccionada al modificar el formulario
    this.taskForm.valueChanges.subscribe(val => {
      const task = this.selectedTask();
      if (task) {
        task.title = val.title;
        task.description = val.description;
        task.due_date = val.due_date ? val.due_date.toISOString().split('T')[0] : null;
        task.is_completed = val.is_completed;
        task.is_urgent = val.is_urgent;
        task.is_important = val.is_important;
        
        // Actualizar subtareas
        if (val.subtasks) {
          task.subtasks = val.subtasks.map((subtaskForm: any) => ({
            id: Math.random().toString(36).substr(2, 9), // ID temporal
            title: subtaskForm.title,
            is_completed: subtaskForm.is_completed
          }));
        }
      }
    });
  }

  // Getter para acceder al FormArray de subtareas
  get subtasks() {
    return this.taskForm.get('subtasks') as FormArray;
  }

  // Método para agregar una nueva subtarea
  addSubtask() {
    this.subtasks.push(this.fb.group({
      title: [''],
      is_completed: [false]
    }));
  }

  // Método para eliminar una subtarea
  removeSubtask(index: number) {
    this.subtasks.removeAt(index);
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
    // Calcular time_end
    let time_end = '';
    if (formValue.time_start && formValue.time_estimated) {
      const [h, m] = formValue.time_start.split(':').map(Number);
      const total = h * 60 + m + Number(formValue.time_estimated);
      const endH = Math.floor(total / 60).toString().padStart(2, '0');
      const endM = (total % 60).toString().padStart(2, '0');
      time_end = `${endH}:${endM}`;
    }
    const updateData = {
      ...formValue,
      time_end,
      subtasks: formValue.subtasks
    };
    this.projectService.updateTask(task.uuid, updateData).subscribe({
      next: (updated) => {
        // Opcional: feedback visual
      },
      error: (err) => {
        // Opcional: feedback de error
      }
    });
  }

  toggleCompletion() {
    if (this.selectedTask()) {
      const completed = !this.selectedTask()!.is_completed;
      this.selectedTask()!.is_completed = completed;
      // Marcar/desmarcar todas las subtareas también
      if (this.selectedTask()!.subtasks) {
        this.selectedTask()!.subtasks.forEach(subtask => subtask.is_completed = completed);
      }
      this.taskForm.patchValue({ is_completed: completed }, { emitEvent: false });
      this.sendUpdate();
    }
  }

  toggleSubtask(subtask: ISubtask) {
    subtask.is_completed = !subtask.is_completed;
    this.sendUpdate();
  }

  // Convierte un valor a string 'yyyy-MM-dd' para el input type="date"
  getDateString(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') return date.substring(0, 10);
    // Si es Date
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
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
    this.sendUpdate();
  }

  onTimeStartChange() {
    this.sendUpdate();
  }

  onTimeEstimatedChange() {
    this.sendUpdate();
  }

  clearSelectedTask(): void {
    this.projectService.setSelectedTask(null);
  }

  // Computed para verificar si se puede eliminar la tarea
  canDeleteTask = computed(() => {
    const task = this.selectedTask();
    return task && task.category === 'custom';
  });

  openDeleteConfirmation() {
    this.showDeleteModal = true;
  }

  closeDeleteDialog() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    this.performDeleteTask();
    this.showDeleteModal = false;
  }

  performDeleteTask() {
    const task = this.selectedTask();
    if (task) {
      // Emitir el evento con la tarea a eliminar
      this.deleteTask.emit(task);
    }
  }

  saveChanges() {
    const task = this.selectedTask();
    if (task) {
      this.saveTask.emit(task);
      this.sendUpdate();
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
    240: '4 horas'
  };

  getDurationText(minutes: string | number): string {
    if (!minutes) return '';
    
    const mins = Number(minutes);
    return this.durationMap[mins] || `${mins} min`;
  }

  saveSubtask(index: number) {
    this.sendUpdate();
  }
}
