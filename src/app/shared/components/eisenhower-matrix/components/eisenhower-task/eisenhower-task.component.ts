import { Component, Input } from '@angular/core';
import { ITask } from '../../../../../interfaces/itask.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eisenhower-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eisenhower-task.component.html',
  styleUrl: './eisenhower-task.component.css',
})
export class EisenhowerTaskComponent {
  @Input({ required: true }) task!: ITask;
}
