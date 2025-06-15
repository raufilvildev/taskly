import { Component } from '@angular/core';
import { TasksComponent } from "../../../shared/components/tasks/tasks.component";

@Component({
  selector: 'app-dashboard-tasks',
  imports: [TasksComponent],
  templateUrl: './dashboard-tasks.component.html',
  styleUrl: './dashboard-tasks.component.css'
})
export class DashboardTasksComponent {

}
