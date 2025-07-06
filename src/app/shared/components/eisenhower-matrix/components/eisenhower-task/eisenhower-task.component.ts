import { Component, Input } from '@angular/core';
import { ITask } from '../../../../../interfaces/itask.interface';
import { CommonModule, DatePipe } from '@angular/common';
import { TasksService } from '../../../../../services/tasks.service';

@Component({
  selector: 'app-eisenhower-task',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './eisenhower-task.component.html',
  styleUrls: ['./eisenhower-task.component.css']
})
export class EisenhowerTaskComponent {
  @Input() task!: ITask;

  constructor(private tasksService: TasksService) {}

  toggleCompletion(event: Event) {
    event.stopPropagation();
    const updateData: Partial<ITask> = {
      is_completed: !this.task.is_completed,
      title: this.task.title,
      description: this.task.description,
      due_date: this.task.due_date,
      is_urgent: this.task.is_urgent,
      is_important: this.task.is_important,
      subtasks: this.task.subtasks,
      category: this.task.category,
      time_start: this.task.time_start,
      time_end: this.task.time_end
    };

    this.tasksService.updateTask(this.task.uuid, updateData).subscribe({
      next: (updatedTask) => {
        // Actualizar el estado local
        this.tasksService.tasks.update(tasks =>
          tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        );
      },
      error: (error) => {
        console.error('Error al actualizar la tarea:', error);
      }
    });
  }
}
