import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ISubtask, ITask } from '../../../interfaces/itask.interface';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @Input() task!: ITask;
  @Input() expanded: boolean = false;
  @Input() isSelected: boolean = false;
  @Input() formatDueDate!: (date: string | undefined) => string;
  @Output() selectTask = new EventEmitter<ITask>();
  @Output() toggleTask = new EventEmitter<ITask>();
  @Output() toggleSubtask = new EventEmitter<ISubtask>();
  @Output() toggleExpand = new EventEmitter<number>();

  isTaskOverdue(): boolean {
    if (!this.task.due_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear a inicio del día
    const dueDate = new Date(this.task.due_date);
    dueDate.setHours(0, 0, 0, 0); // Resetear a inicio del día
    return dueDate < today && !this.task.is_completed;
  }
}
