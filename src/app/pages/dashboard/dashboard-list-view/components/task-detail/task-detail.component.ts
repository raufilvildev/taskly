import { Component, inject, computed, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ProjectService } from '../../../../../services/tasks.service';
import { Isubtask, Itask } from '../../../../../interfaces/itask';

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
  selectedTask = this.projectService.selectedTask;
  taskForm: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.taskForm = this.fb.group({
      title: [''],
      description: [''],
      dueDate: [null],
      completed: [false]
    });

    // Sincroniza el formulario con la tarea seleccionada
    effect(() => {
      const task = this.selectedTask();
      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          completed: task.completed
        }, { emitEvent: false });
      }
    });

    // Actualiza la tarea seleccionada al modificar el formulario
    this.taskForm.valueChanges.subscribe(val => {
      const task = this.selectedTask();
      if (task) {
        task.title = val.title;
        task.description = val.description;
        task.dueDate = val.dueDate;
        task.completed = val.completed;
      }
    });
  }

  // Computed para subtareas de la tarea seleccionada
  selectedTaskSubtasks = computed(() => {
    return (this.selectedTask() as Itask)?.subtasks ?? [];
  });

  toggleCompletion() {
    if (this.selectedTask()) {
      this.selectedTask()!.completed = !this.selectedTask()!.completed;
    }
  }

  toggleSubtask(subtask: Isubtask) {
    subtask.completed = !subtask.completed;
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
    this.taskForm.get('dueDate')?.setValue(value ? value : null);
  }
}