import { Component } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { ListGroupsComponent } from "./components/list-groups/list-groups.component";
import { TaskListComponent } from "./components/task-list/task-list.component";
import { TaskDetailComponent } from "./components/task-detail/task-detail.component";

@Component({
  selector: 'app-dashboard-list-view',
  imports: [AngularSplitModule, ListGroupsComponent, TaskListComponent, TaskDetailComponent],
  templateUrl: './dashboard-list-view.component.html',
  styleUrl: './dashboard-list-view.component.css'
})
export class DashboardListViewComponent {

}
