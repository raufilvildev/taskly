import { Component, inject, computed, effect, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TasksService } from '../../../services/tasks.service';
import { ISubtask, ITask } from '../../../interfaces/itask';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule
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
  selectedTask = computed(() => this.projectService.selectedTask());
  taskForm: FormGroup;
  private fb = inject(FormBuilder);
  showDeleteModal = false;

  // Opciones para priority_color
  priorityColors = [
    { value: 'neutral', label: 'Neutral', class: 'bg-gray-200 text-gray-800' },
    { value: 'yellow', label: 'Amarillo', class: 'bg-yellow-200 text-yellow-800' },
    { value: 'red', label: 'Rojo', class: 'bg-red-200 text-red-800' }
  ];

  constructor() {
    this.taskForm = this.fb.group({
      title: [''],
      description: [''],
      due_date: [null],
      is_completed: [false],
      is_urgent: [false],
      is_important: [false],
      priority_color: ['neutral']
    });

    // Sincroniza el formulario con la tarea seleccionada
    effect(() => {
      const task = this.selectedTask();
      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          is_completed: task.is_completed,
          is_urgent: task.is_urgent,
          is_important: task.is_important,
          priority_color: task.priority_color
        }, { emitEvent: false });
      }
    });

    // Actualiza la tarea seleccionada al modificar el formulario
    this.taskForm.valueChanges.subscribe(val => {
      const task = this.selectedTask();
      if (task) {
        task.title = val.title;
        task.description = val.description;
        task.due_date = val.due_date;
        task.is_completed = val.is_completed;
        task.is_urgent = val.is_urgent;
        task.is_important = val.is_important;
        task.priority_color = val.priority_color;
      }
    });
  }

  // Computed para subtareas de la tarea seleccionada
  selectedTaskSubtasks = computed(() => {
    return (this.selectedTask() as ITask)?.subtasks ?? [];
  });

  toggleCompletion() {
    if (this.selectedTask()) {
      const completed = !this.selectedTask()!.is_completed;
      this.selectedTask()!.is_completed = completed;
      // Marcar/desmarcar todas las subtareas también
      if (this.selectedTask()!.subtasks) {
        this.selectedTask()!.subtasks.forEach(subtask => subtask.is_completed = completed);
      }
      this.taskForm.patchValue({ is_completed: completed }, { emitEvent: false });
    }
  }

  toggleSubtask(subtask: ISubtask) {
    subtask.is_completed = !subtask.is_completed;
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
      console.log('Eliminando tarea:', task.id);
    }
  }

  saveChanges() {
    const task = this.selectedTask();
    if (task) {
      // Emitir el evento con la tarea actualizada
      this.saveTask.emit(task);
      console.log('Guardando cambios de tarea:', task);
    }
  }
}
