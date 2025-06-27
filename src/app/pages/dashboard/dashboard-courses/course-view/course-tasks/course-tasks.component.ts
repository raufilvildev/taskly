import { Component, inject } from '@angular/core';
import { TasksComponent } from '../../../../../shared/components/tasks/tasks.component';
import { UsersService } from '../../../../../services/users.service';

@Component({
  selector: 'app-course-tasks',
  imports: [TasksComponent],
  templateUrl: './course-tasks.component.html',
  styleUrl: './course-tasks.component.css',
})
export class CourseTasksComponent {
  usersService = inject(UsersService);
  get isTeacher(): boolean {
    return this.usersService.currentUser.role === 'teacher';
  }
}
