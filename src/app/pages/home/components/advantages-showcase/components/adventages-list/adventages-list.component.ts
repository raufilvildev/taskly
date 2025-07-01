import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

interface AdvantageItem {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-adventages-list',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './adventages-list.component.html',
})
export class AdventagesListComponent {
  @Input() item!: AdvantageItem;
  @Input() type!: 'teacher' | 'alumn';
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
}
