import { Component } from '@angular/core';
import { TasksComponent } from '../../../../../shared/components/tasks/tasks.component';

@Component({
  selector: 'app-course-tasks',
  imports: [TasksComponent],
  templateUrl: './course-tasks.component.html',
  styleUrl: './course-tasks.component.css',
})
export class CourseTasksComponent {}
