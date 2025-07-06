import { Component, computed, inject } from '@angular/core';
import { ITask } from '../../../interfaces/itask.interface';
import { CommonModule } from '@angular/common';
import { EisenhowerTaskComponent } from './components/eisenhower-task/eisenhower-task.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TasksService } from '../../../services/tasks.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-eisenhower-matrix',
  imports: [CommonModule, EisenhowerTaskComponent, DragDropModule, MatIconModule],
  templateUrl: './eisenhower-matrix.component.html',
  styleUrl: './eisenhower-matrix.component.css',
})
export class EisenhowerMatrixComponent {
  private tasksService = inject(TasksService);

  tasks = computed(() => this.tasksService.tasks());

  urgentImportant = computed(() =>
    this.tasks().filter((task) => !task.is_completed && task.is_urgent && task.is_important)
  );
  notUrgentImportant = computed(() =>
    this.tasks().filter((task) => !task.is_completed && !task.is_urgent && task.is_important)
  );
  urgentNotImportant = computed(() =>
    this.tasks().filter((task) => !task.is_completed && task.is_urgent && !task.is_important)
  );
  notUrgentNotImportant = computed(() =>
    this.tasks().filter((task) => !task.is_completed && !task.is_urgent && !task.is_important)
  );

  quadrants = [
    {
      id: 'urgent-important',
      title: 'Urgente e Importante',
      icon: 'error',
      colorClass: 'text-red-400',
      tasks: this.urgentImportant,
    },
    {
      id: 'not-urgent-important',
      title: 'No Urgente e Importante',
      icon: 'school',
      colorClass: 'text-yellow-400',
      tasks: this.notUrgentImportant,
    },
    {
      id: 'urgent-not-important',
      title: 'Urgente y No Importante',
      icon: 'edit',
      colorClass: 'text-blue-400',
      tasks: this.urgentNotImportant,
    },
    {
      id: 'not-urgent-not-important',
      title: 'No Urgente y No Importante',
      icon: 'check_circle_outline',
      colorClass: 'text-green-400',
      tasks: this.notUrgentNotImportant,
    },
  ];

  ngOnInit(): void {
    // Cargar todas las tareas al inicializar
    this.tasksService.getAllTasks().subscribe((tasks) => {
      this.tasksService.tasks.set(tasks);
    });
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      // Reordering within the same list, do nothing for now
      return;
    }

    const task = event.item.data as ITask;
    const newQuadrantId = event.container.id;

    let properties: { is_urgent?: boolean; is_important?: boolean } = {};

    switch (newQuadrantId) {
      case 'urgent-important':
        properties = { is_urgent: true, is_important: true };
        break;
      case 'not-urgent-important':
        properties = { is_urgent: false, is_important: true };
        break;
      case 'urgent-not-important':
        properties = { is_urgent: true, is_important: false };
        break;
      case 'not-urgent-not-important':
        properties = { is_urgent: false, is_important: false };
        break;
    }

    // Actualizar en el backend
    this.tasksService.updateTaskPropertiesByUuid(task.uuid, properties).subscribe({
      next: (updatedTask) => {
        // Actualizar el estado local solo después de que el backend confirme el cambio
        this.tasksService.updateTaskProperties(task.id, properties);
      },
      error: (error) => {
        console.error('Error updating task properties:', error);
        // Aquí podrías añadir alguna notificación al usuario si lo deseas
      }
    });
  }
}
