import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css']
})
export class TaskFilterComponent {
  @Output() filterChange = new EventEmitter<{
    categoryFilters: string[];
    showCompleted: boolean;
    showPending: boolean;
  }>();

  selectedCategoryFilters: string[] = ['personales', 'cursos']; // Por defecto ambos activos
  showCompletedTasks: boolean = false;
  showPendingTasks: boolean = true; // Por defecto mostrar pendientes

  toggleCategoryFilter(filter: string) {
    if (this.selectedCategoryFilters.includes(filter)) {
      this.selectedCategoryFilters = this.selectedCategoryFilters.filter(f => f !== filter);
    } else {
      this.selectedCategoryFilters.push(filter);
    }
    this.emitFilterChange();
  }

  toggleCompletedTasks() {
    this.showCompletedTasks = !this.showCompletedTasks;
    this.emitFilterChange();
  }

  togglePendingTasks() {
    this.showPendingTasks = !this.showPendingTasks;
    this.emitFilterChange();
  }

  private emitFilterChange() {
    this.filterChange.emit({
      categoryFilters: this.selectedCategoryFilters,
      showCompleted: this.showCompletedTasks,
      showPending: this.showPendingTasks
    });
  }

  // Método para resetear filtros
  resetFilters() {
    this.selectedCategoryFilters = ['personales', 'cursos']; // Reset a ambos activos
    this.showCompletedTasks = false;
    this.showPendingTasks = true; // Reset a mostrar pendientes
    this.emitFilterChange();
  }
} 