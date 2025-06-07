import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Itask, Isubtask } from '../../models/types';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @Input() task!: Itask;
  @Input() expanded: boolean = false;
  @Input() isSelected: boolean = false;
  @Input() getTaskProgress!: (task: Itask) => { completed: number, total: number };
  @Input() formatDueDate!: (date: Date | undefined) => string;
  @Output() selectTask = new EventEmitter<Itask>();
  @Output() toggleTask = new EventEmitter<Itask>();
  @Output() toggleSubtask = new EventEmitter<Isubtask>();
  @Output() toggleExpand = new EventEmitter<number>();
}
