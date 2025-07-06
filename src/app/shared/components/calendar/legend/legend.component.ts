import { Component, signal, computed, output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TaskFilters {
  isUrgent: boolean;
  isImportant: boolean;
}

@Component({
  selector: 'app-calendar-legend',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class CalendarLegendComponent implements OnInit {
  @Input() initialFilters: TaskFilters = {
    isUrgent: false,
    isImportant: false
  };

  filters = signal<TaskFilters>({
    isUrgent: false,
    isImportant: false
  });

  filtersChanged = output<TaskFilters>();

  ngOnInit() {
    this.filters.set(this.initialFilters);
  }

  toggleFilter(filterType: keyof TaskFilters) {
    this.filters.update(current => ({
      ...current,
      [filterType]: !current[filterType]
    }));
    this.filtersChanged.emit(this.filters());
  }
}
