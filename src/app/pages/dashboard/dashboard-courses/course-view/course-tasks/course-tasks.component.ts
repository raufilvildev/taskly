import { Component, inject, Input } from '@angular/core';
import { TasksComponent } from '../../../../../shared/components/tasks/tasks.component';
import { UsersService } from '../../../../../services/users.service';

@Component({
  selector: 'app-course-tasks',
  standalone: true,
  imports: [TasksComponent],
  templateUrl: './course-tasks.component.html',
  styleUrl: './course-tasks.component.css',
})
export class CourseTasksComponent {
  usersService = inject(UsersService);

  /** Parte de tasks_formulario */
  get isTeacher(): boolean {
    return this.usersService.currentUser.role === 'teacher';
  }

  /** Parte de main */
  @Input() course_uuid = '';
  user_role: 'general' | 'student' | 'teacher' = 'general';

  async ngOnInit() {
    try {
      const { role } = await this.usersService.getByToken();
      this.user_role = role;
    } catch (error) {
      return;
    }
  }
}
