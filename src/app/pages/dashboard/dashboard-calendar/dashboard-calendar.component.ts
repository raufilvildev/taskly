import { Component, inject, computed } from '@angular/core';
import { TaskDetailComponent } from "../../../shared/components/task-detail/task-detail.component";
import { TableComponent } from "../../../shared/components/calendar/table/calendar-table.component";
import { DashboardLayoutService } from "../../../services/dashboard-layout.service";
import { TasksService } from "../../../services/tasks.service";

@Component({
  selector: 'app-dashboard-calendar',
  imports: [TaskDetailComponent, TableComponent],
  templateUrl: './dashboard-calendar.component.html',
  styleUrl: './dashboard-calendar.component.css'
})
export class DashboardCalendarComponent {
  dashboardLayoutService = inject(DashboardLayoutService);
  tasksService = inject(TasksService);

  get isAsideCollapsed() {
    return this.dashboardLayoutService.isAsideCollapsed;
  }

  get hasSelectedTask() {
    return computed(() => this.tasksService.selectedTask() !== null);
  }
}
