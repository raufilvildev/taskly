import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { ITask } from '../../../interfaces/itask';
import { TasksService } from '../../../services/tasks.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list-groups',
  standalone: true,
  imports: [ MatIconModule ],
  templateUrl: './list-groups.component.html',
  styleUrls: ['./list-groups.component.css']
})
export class ListGroupsComponent {
  private projectService = inject(TasksService);
  projects = this.projectService.tasks;

  @Output() filteredTasks = new EventEmitter<{ tasks: ITask[], selectedFilter: string | null }>();

  @Input() isCourse: boolean = false;

  selectedFilter: string | null = null;

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.filteredTasks.emit({ tasks: this.getFilteredTasks(), selectedFilter: this.selectedFilter });
  }

  getFilteredTasks(): ITask[] {
    const tasks = this.projects();
    const today = new Date().toISOString().slice(0, 10);
    if (this.selectedFilter === 'hoy') {
      return tasks.filter(t => t.due_date === today);
    }
    if (this.selectedFilter === '7dias') {
      const now = new Date();
      const in7 = new Date();
      in7.setDate(now.getDate() + 7);
      return tasks.filter(t => t.due_date && t.due_date >= today && t.due_date <= in7.toISOString().slice(0, 10));
    }
    if (this.selectedFilter === '30dias') {
      const now = new Date();
      const in30 = new Date();
      in30.setDate(now.getDate() + 30);
      return tasks.filter(t => t.due_date && t.due_date >= today && t.due_date <= in30.toISOString().slice(0, 10));
    }
    if (this.selectedFilter === 'personales') {
      return tasks.filter(t => t.category === 'custom');
    }
    if (this.selectedFilter === 'cursos') {
      return tasks.filter(t => t.category !== 'custom');
    }
    if (this.selectedFilter === 'completadas') {
      return tasks.filter(t => t.is_completed);
    }
    return tasks;
  }
}
