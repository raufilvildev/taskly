import { Component, inject, Input } from '@angular/core';
import { TasksComponent } from '../../../../../shared/components/tasks/tasks.component';
import { initUser } from '../../../../../shared/utils/initializers';
import { IGetByTokenUser } from '../../../../../interfaces/iuser.interface';
import { UsersService } from '../../../../../services/users.service';

@Component({
  selector: 'app-course-tasks',
  imports: [TasksComponent],
  templateUrl: './course-tasks.component.html',
  styleUrl: './course-tasks.component.css',
})
export class CourseTasksComponent {
  usersService = inject(UsersService);

  @Input() course_uuid = '';

  user_role: 'general' | 'student' | 'teacher' = 'general';
  async ngOnInit() {
    try {
      const { role } = await this.usersService.getByToken();
      this.user_role = role;
      console.log('User role:', this.user_role);
    } catch (error) {
      return;
    }
  }
}
