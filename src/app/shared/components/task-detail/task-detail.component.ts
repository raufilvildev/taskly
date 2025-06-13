import { Component, inject, computed, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ProjectService } from '../../../services/tasks.service';
import { ISubtask, ITask } from '../../../interfaces/itask';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent {
  private projectService = inject(ProjectService);
  selectedTask = computed(() => this.projectService.selectedTask());
  taskForm: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.taskForm = this.fb.group({
      title: [''],
      description: [''],
      due_date: [null],
      is_completed: [false]
    });

    // Sincroniza el formulario con la tarea seleccionada
    effect(() => {
      const task = this.selectedTask();
      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          is_completed: task.is_completed
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
}