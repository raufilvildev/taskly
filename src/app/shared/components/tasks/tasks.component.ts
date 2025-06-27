import { Component, Input, HostListener } from '@angular/core';
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
  @Input() isCourse: boolean = false;
  @Input() isTeacher: boolean = false;
  tasks: ITask[] = [];
  selectedFilter: string | null = null;

  // Responsive y navegación
  isMobile = window.innerWidth <= 768;
  currentView: 'groups' | 'list' | 'detail' = 'groups';

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  onFilteredTasks(event: { tasks: ITask[], selectedFilter: string | null }) {
    this.tasks = event.tasks;
    this.selectedFilter = event.selectedFilter;
    if (this.isMobile) {
      this.currentView = 'list';
    }
  }

  goToGroups() { this.currentView = 'groups'; }
  goToList() { this.currentView = 'list'; }
  goToDetail() { this.currentView = 'detail'; }
}
