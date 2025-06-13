import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ISubtask, ITask } from '../../../interfaces/itask';

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
  @Input() getTaskProgress!: (task: ITask) => { completed: number, total: number };
  @Input() formatDueDate!: (date: string | undefined) => string;
  @Output() selectTask = new EventEmitter<ITask>();
  @Output() toggleTask = new EventEmitter<ITask>();
  @Output() toggleSubtask = new EventEmitter<ISubtask>();
  @Output() toggleExpand = new EventEmitter<number>();
}
