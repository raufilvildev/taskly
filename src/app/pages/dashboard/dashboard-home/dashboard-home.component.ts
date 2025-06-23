import { Component } from '@angular/core';
import { TableComponent } from "../../../shared/components/calendar/table/calendar-table.component";
import { TasksComponent } from "../../../shared/components/tasks/tasks.component";
import { TaskListComponent } from '../../../shared/components/task-list/task-list.component';
import { ITask } from '../../../interfaces/itask';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-dashboard-home',
  imports: [TableComponent, TaskListComponent, RouterLink],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent {
  tasks: ITask[] = [];

}
