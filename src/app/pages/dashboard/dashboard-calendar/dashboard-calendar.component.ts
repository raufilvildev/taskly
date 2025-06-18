import { Component } from '@angular/core';
import { TaskDetailComponent } from "../../../shared/components/task-detail/task-detail.component";

@Component({
  selector: 'app-dashboard-calendar',
  imports: [TaskDetailComponent],
  templateUrl: './dashboard-calendar.component.html',
  styleUrl: './dashboard-calendar.component.css'
})
export class DashboardCalendarComponent {

}
