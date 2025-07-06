import { Component, inject, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { ITask } from '../../../interfaces/itask.interface';
import { TasksService } from '../../../services/tasks.service';
import { MatIconModule } from '@angular/material/icon';
import { TaskFilterComponent } from '../task-filter/task-filter.component';

@Component({
  selector: 'app-list-groups',
  standalone: true,
  imports: [MatIconModule, TaskFilterComponent],
  templateUrl: './list-groups.component.html',
  styleUrls: ['./list-groups.component.css']
})
export class ListGroupsComponent implements OnInit {
  private projectService = inject(TasksService);

  @Output() filteredTasks = new EventEmitter<{ tasks: ITask[], selectedFilter: string | null }>();
  @Output() navigateToList = new EventEmitter<void>(); // Nuevo evento para navegar a la lista

  @Input() isCourse: boolean = false;
  @Input() course_uuid: string = ''; // Añadir input para course_uuid
  @Input() showAdditionalFilters: boolean = true; // Controla si se muestran los filtros adicionales

  selectedTimeFilter: string | null = null; // Cambiado a null para móvil
  selectedCategoryFilters: string[] = ['personales', 'cursos']; // Filtros de categoría múltiples
  showCompletedTasks: boolean = false; // Filtro de tareas completadas
  showPendingTasks: boolean = true; // Filtro de tareas pendientes
  currentTasks: ITask[] = []; // Tareas cargadas del API

  ngOnInit() {
    // Solo inicializar con filtro por defecto si estamos en desktop (con filtros adicionales)
    if (this.showAdditionalFilters) {
      this.selectedTimeFilter = 'hoy';
      this.loadTasksByPeriod('today');
    }
  }

  selectTimeFilter(filter: string) {
    this.selectedTimeFilter = filter;

    // Mapear los filtros del frontend a los del API
    const periodMap: { [key: string]: 'today' | 'week' | 'month' } = {
      'hoy': 'today',
      '7dias': 'week',
      '30dias': 'month'
    };

    if (periodMap[filter]) {
      this.loadTasksByPeriod(periodMap[filter]);
    }
  }

  onFilterChange(filters: { categoryFilters: string[]; showCompleted: boolean; showPending: boolean }) {
    this.selectedCategoryFilters = filters.categoryFilters;
    this.showCompletedTasks = filters.showCompleted;
    this.showPendingTasks = filters.showPending;
    this.applyFilters();
  }

  loadTasksByPeriod(period: 'today' | 'week' | 'month') {
    if (this.isCourse && this.course_uuid) {
      this.projectService.getTasksByCourseUuid(this.course_uuid, period).subscribe({
        next: (tasks) => {
          this.currentTasks = tasks;
          this.applyFilters();
        },
        error: (error) => {
          this.currentTasks = [];
          this.applyFilters();
        }
      });
    } else {
      this.projectService.getTasksByPeriod(period).subscribe({
        next: (tasks) => {
          this.currentTasks = tasks;
          this.applyFilters();
        },
        error: (error) => {
          this.currentTasks = [];
          this.applyFilters();
        }
      });
    }
  }

  applyFilters() {
    let filteredTasks = [...this.currentTasks];

    // Aplicar filtros de categoría (múltiples)
    if (this.selectedCategoryFilters.length > 0) {
      filteredTasks = filteredTasks.filter(task => {
        const isPersonal = task.category === 'custom';
        const isCourse = task.category === 'course_related';

        const matchesPersonal = this.selectedCategoryFilters.includes('personales') && isPersonal;
        const matchesCourse = this.selectedCategoryFilters.includes('cursos') && isCourse;

        return matchesPersonal || matchesCourse;
      });
    }

    // Aplicar filtros de estado de tareas
    const statusFilters: ((task: ITask) => boolean)[] = [];

    if (this.showPendingTasks) {
      statusFilters.push((t: ITask) => !t.is_completed);
    }

    if (this.showCompletedTasks) {
      statusFilters.push((t: ITask) => t.is_completed);
    }

    // Si no hay filtros de estado seleccionados, no mostrar ninguna tarea
    if (statusFilters.length === 0) {
      filteredTasks = [];
    } else {
      // Aplicar filtros de estado (OR lógico - mostrar tareas que cumplan cualquiera de los filtros)
      filteredTasks = filteredTasks.filter(task => {
        const matches = statusFilters.some(filter => filter(task));
        return matches;
      });
    }

    // Emitir las tareas filtradas
    this.filteredTasks.emit({
      tasks: filteredTasks,
      selectedFilter: this.selectedTimeFilter + (this.selectedCategoryFilters.length > 0 ? `-${this.selectedCategoryFilters.join('-')}` : '') + (this.showCompletedTasks ? '-completed' : '') + (this.showPendingTasks ? '-pending' : '')
    });
  }
}
