import { Component, inject } from '@angular/core';
import { ROUTER_OUTLET_DATA, RouterLink } from '@angular/router';
import { ICourse } from '../../../../interfaces/icourse.interface';
import { CoursesService } from '../../../../services/courses.service';
import { AuthorizationService } from '../../../../services/authorization.service';
import { IUser } from '../../../../interfaces/iuser.interface';
import { UsersService } from '../../../../services/users.service';
import { CourseFormComponent } from './components/course-form/course-form.component';

@Component({
  selector: 'app-courses-grid',
  imports: [RouterLink, CourseFormComponent],
  templateUrl: './courses-grid.component.html',
  styleUrl: './courses-grid.component.css',
})
export class CoursesGridComponent {
  usersService = inject(UsersService);
  authorizationService = inject(AuthorizationService);
  coursesService = inject(CoursesService);

  user = inject<IUser>(ROUTER_OUTLET_DATA);
  courses: ICourse[] = [];
  showCourseForm = false;

  async ngOnInit() {
    try {
      const token: string = this.authorizationService.getToken();
      this.courses = await this.coursesService.getAll(token);
    } catch (error) {
      return;
    }
  }
}
