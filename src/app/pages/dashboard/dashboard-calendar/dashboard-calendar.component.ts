import { Component, inject, computed, signal } from '@angular/core';
import { TaskDetailComponent } from "../../../shared/components/task-detail/task-detail.component";
import { TableComponent } from "../../../shared/components/calendar/table/calendar-table.component";
import { DashboardLayoutService } from "../../../services/dashboard-layout.service";
import { TasksService } from "../../../services/tasks.service";
import { ITask } from '../../../interfaces/itask.interface';

@Component({
  selector: 'app-dashboard-calendar',
  imports: [TaskDetailComponent, TableComponent],
  templateUrl: './dashboard-calendar.component.html',
  styleUrl: './dashboard-calendar.component.css'
})
export class DashboardCalendarComponent {
  dashboardLayoutService = inject(DashboardLayoutService);
  tasksService = inject(TasksService);

  tasks = signal<ITask[]>([]);

  ngOnInit(): void {
    // Cargar todas las tareas
    this.tasksService.getAllTasks().subscribe(tasks => {
      this.tasks.set(tasks);
    });
  }

  onTaskSelected(task: ITask): void {
    this.tasksService.setSelectedTask(task);
  }

  get isAsideCollapsed() {
    return this.dashboardLayoutService.isAsideCollapsed;
  }

  hasSelectedTask = computed(() => this.tasksService.selectedTask() !== null);
}
