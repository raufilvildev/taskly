import { Component, Input, HostListener, inject } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { ListGroupsComponent } from '../list-groups/list-groups.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { ITask } from '../../../interfaces/itask.interface';
import { TasksService } from '../../../services/tasks.service';

@Component({
  selector: 'app-tasks',
  imports: [AngularSplitModule, ListGroupsComponent, TaskListComponent, TaskDetailComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {
  private projectService = inject(TasksService);

  @Input() isCourse: boolean = false;
  @Input() isTeacher: boolean = false;
  @Input() course_uuid = '';
  @Input() user_role: 'general' | 'student' | 'teacher' = 'general';

  tasks: ITask[] = [];
  selectedFilter: string | null = null;

  // Responsive y navegación. Lo uso para que se pueda navegar entre componentes en el tasks
  isMobile = window.innerWidth <= 768;
  currentView: 'groups' | 'list' | 'detail' = 'groups';

  // Variables para manejar filtros adicionales
  selectedCategoryFilters: string[] = ['personales', 'cursos'];
  showCompletedTasks: boolean = false;
  showPendingTasks: boolean = true;

  // Variable para mantener las tareas filtradas por período
  periodFilteredTasks: ITask[] = [];

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  onFilteredTasks(event: { tasks: ITask[], selectedFilter: string | null }) {
    // Guardar las tareas filtradas por período
    this.periodFilteredTasks = event.tasks;
    this.selectedFilter = event.selectedFilter;

    // Aplicar filtros adicionales si estamos en móvil
    if (this.isMobile) {
      this.currentView = 'list';
      this.applyAdditionalFilters();
    } else {
      // En desktop, usar las tareas tal como vienen
      this.tasks = event.tasks;
    }
  }

  onFilterChange(filters: { categoryFilters: string[]; showCompleted: boolean; showPending: boolean }) {
    this.selectedCategoryFilters = filters.categoryFilters;
    this.showCompletedTasks = filters.showCompleted;
    this.showPendingTasks = filters.showPending;

    // Aplicar filtros adicionales a las tareas actuales
    this.applyAdditionalFilters();
  }

  applyAdditionalFilters() {
    // Usar las tareas ya filtradas por período, no todas las tareas
    let filteredTasks = [...this.periodFilteredTasks];

    // Aplicar filtros de categoría (múltiples)
    if (this.selectedCategoryFilters.length > 0) {
      filteredTasks = filteredTasks.filter((task: ITask) => {
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
      // Aplicar filtros de estado (OR lógico)
      filteredTasks = filteredTasks.filter((task: ITask) => {
        return statusFilters.some(filter => filter(task));
      });
    }

    // Actualizar las tareas mostradas
    this.tasks = filteredTasks;
  }

  goToGroups() {
    this.currentView = 'groups';
    // Limpiar las tareas cuando volvemos a groups en móvil
    if (this.isMobile) {
      this.tasks = [];
      this.selectedFilter = null;
    }
  }
  goToList() {
    this.currentView = 'list';
  }
  goToDetail() {
    this.currentView = 'detail';
  }
}
