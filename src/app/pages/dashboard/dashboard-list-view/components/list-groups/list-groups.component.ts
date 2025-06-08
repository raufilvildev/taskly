import { Component, inject } from '@angular/core';
import { Ilist } from '../../../../../interfaces/ilist';
import { ProjectService } from '../../../../../services/tasks.service';

@Component({
  selector: 'app-list-groups',
  standalone: true,
  imports: [ ],
  templateUrl: './list-groups.component.html',
  styleUrls: ['./list-groups.component.css']
})
export class ListGroupsComponent {
  private projectService = inject(ProjectService);
  projects = this.projectService.projects;
  selectedProject = this.projectService.selectedProject;

  selectProject(project: Ilist) {
    this.projectService.setSelectedProject(project);
  }

  isProjectSelected(project: Ilist): boolean {
    return this.selectedProject()?.id === project.id;
  }

  getTaskCount(project: Ilist): number {
    return project.tasks.length;
  }

  getCompletedTaskCount(project: Ilist): number {
    return project.tasks.filter(task => task.completed).length;
  }
}