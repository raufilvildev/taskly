import { Component, computed, inject, Input, signal } from '@angular/core';
import { TasksService } from '../../../../../services/tasks.service';
import { DashboardLayoutService } from '../../../../../services/dashboard-layout.service';
import { TaskDetailComponent } from '../../../../../shared/components/task-detail/task-detail.component';
import { TableComponent } from '../../../../../shared/components/calendar/table/calendar-table.component';
import { ITask } from '../../../../../interfaces/itask.interface';

@Component({
  selector: 'app-course-calendar',
  imports: [TaskDetailComponent, TableComponent],
  templateUrl: './course-calendar.component.html',
  styleUrl: './course-calendar.component.css',
})
export class CourseCalendarComponent {
  dashboardLayoutService = inject(DashboardLayoutService);
  tasksService = inject(TasksService);

  @Input() course_uuid = '';
  tasks = signal<ITask[]>([]);

  ngOnInit(): void {
    // Initial load of tasks
    this.loadTasks();
  }

  loadTasks(): void {
    // Get all tasks without filter
    this.tasksService.getTasksByCourseUuid(this.course_uuid).subscribe(tasks => {
      this.tasks.set(tasks);
    });
  }

  onTaskSelected(task: ITask): void {
    this.tasksService.setSelectedTask(task);
  }

  onMonthChanged(): void {
    // Reload tasks when month changes
    this.loadTasks();
  }

  get isAsideCollapsed() {
    return this.dashboardLayoutService.isAsideCollapsed;
  }

  hasSelectedTask = computed(() => this.tasksService.selectedTask() !== null);
}
