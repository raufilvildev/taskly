import { Component } from '@angular/core';
import { TaskDetailComponent } from "../../../shared/components/task-detail/task-detail.component";
import { TableComponent } from "../../../shared/components/calendar/table/calendar-table.component";

@Component({
  selector: 'app-dashboard-calendar',
  imports: [TaskDetailComponent, TableComponent],
  templateUrl: './dashboard-calendar.component.html',
  styleUrl: './dashboard-calendar.component.css'
})
export class DashboardCalendarComponent {

}
