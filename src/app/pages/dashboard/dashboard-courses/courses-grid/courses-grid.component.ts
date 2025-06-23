import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICourse } from '../../../../interfaces/icourse.interface';
import { CoursesService } from '../../../../services/courses.service';
import { IGetByTokenUser } from '../../../../interfaces/iuser.interface';
import { UsersService } from '../../../../services/users.service';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { initUser } from '../../../../shared/utils/initializers';
import { environment } from '../../../../environments/environment.test';

@Component({
  selector: 'app-courses-grid',
  imports: [RouterLink, CourseFormComponent],
  templateUrl: './courses-grid.component.html',
  styleUrl: './courses-grid.component.css',
})
export class CoursesGridComponent {
  usersService = inject(UsersService);
  coursesService = inject(CoursesService);

  user: IGetByTokenUser = initUser();
  courses: ICourse[] = [];
  showCourseForm = false;

  course_image_endpoint = `${environment.host}/uploads/courses/`;

  async updateGrid() {
    this.showCourseForm = false;
    try {
      this.courses = await this.coursesService.getAll();
    } catch (error) {
      return;
    }
  }

  async ngOnInit() {
    try {
      this.user = await this.usersService.getByToken();
      await this.updateGrid();
    } catch (error) {
      return;
    }
  }
}
