import { Component, computed, inject, Input } from '@angular/core';
import { TasksService } from '../../../../../services/tasks.service';
import { DashboardLayoutService } from '../../../../../services/dashboard-layout.service';
import { TaskDetailComponent } from '../../../../../shared/components/task-detail/task-detail.component';
import { TableComponent } from '../../../../../shared/components/calendar/table/calendar-table.component';

@Component({
  selector: 'app-course-calendar',
  imports: [TaskDetailComponent, TableComponent],
  templateUrl: './course-calendar.component.html',
  styleUrl: './course-calendar.component.css',
})
export class CourseCalendarComponent  {
  dashboardLayoutService = inject(DashboardLayoutService);
  tasksService = inject(TasksService);

  @Input() course_uuid = '';

  ngOnInit(): void {
    // Cargar las tareas del curso
    this.tasksService.getTasksByCourseUuid(this.course_uuid, 'month').subscribe(tasks => {
      this.tasksService.tasks.set(tasks);
    });
  }

  get isAsideCollapsed() {
    return this.dashboardLayoutService.isAsideCollapsed;
  }

  hasSelectedTask = computed(() => this.tasksService.selectedTask() !== null);
}
