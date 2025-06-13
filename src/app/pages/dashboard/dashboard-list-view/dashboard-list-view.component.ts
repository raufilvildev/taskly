import { Component } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { ListGroupsComponent } from "./components/list-groups/list-groups.component";
import { TaskListComponent } from "../../../shared/components/task-list/task-list.component";
import { TaskDetailComponent } from "../../../shared/components/task-detail/task-detail.component";
import { ITask } from '../../../interfaces/itask';

@Component({
  selector: 'app-dashboard-list-view',
  imports: [AngularSplitModule, ListGroupsComponent, TaskListComponent, TaskDetailComponent],
  templateUrl: './dashboard-list-view.component.html',
  styleUrl: './dashboard-list-view.component.css'
})
export class DashboardListViewComponent {
  tasks: ITask[] = [];
}
