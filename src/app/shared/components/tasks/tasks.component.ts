import { Component } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { ListGroupsComponent } from "../list-groups/list-groups.component";
import { TaskListComponent } from "../task-list/task-list.component";
import { TaskDetailComponent } from "../task-detail/task-detail.component";
import { ITask } from '../../../interfaces/itask';

@Component({
  selector: 'app-tasks',
  imports: [AngularSplitModule, ListGroupsComponent, TaskListComponent, TaskDetailComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  tasks: ITask[] = [];
}
