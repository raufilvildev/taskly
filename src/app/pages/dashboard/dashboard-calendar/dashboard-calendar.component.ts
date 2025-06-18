import { Component, inject } from '@angular/core';
import { TaskDetailComponent } from "../../../shared/components/task-detail/task-detail.component";
import { TableComponent } from "../../../shared/components/calendar/table/calendar-table.component";
import { DashboardLayoutService } from "../../../services/dashboard-layout.service";

@Component({
  selector: 'app-dashboard-calendar',
  imports: [TaskDetailComponent, TableComponent],
  templateUrl: './dashboard-calendar.component.html',
  styleUrl: './dashboard-calendar.component.css'
})
export class DashboardCalendarComponent {
  dashboardLayoutService = inject(DashboardLayoutService);

  get isAsideCollapsed() {
    return this.dashboardLayoutService.isAsideCollapsed;
  }
}
