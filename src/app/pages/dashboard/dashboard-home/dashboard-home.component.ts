import { Component } from '@angular/core';
import { TableComponent } from "../../../shared/components/calendar/table/calendar-table.component";
import { TasksComponent } from "../../../shared/components/tasks/tasks.component";
import { TaskListComponent } from '../../../shared/components/task-list/task-list.component';
import { ITask } from '../../../interfaces/itask';
import { RouterLink } from '@angular/router';
import { DashboardHomeCalendarComponent } from './components/dashboard-home-calendar/dashboard-home-calendar.component';
import { UsersService } from '../../../services/users.service';



@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [TaskListComponent, RouterLink, DashboardHomeCalendarComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent {
  tasks: ITask[] = [];

}
