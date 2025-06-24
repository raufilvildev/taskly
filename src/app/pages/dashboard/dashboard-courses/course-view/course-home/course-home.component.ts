import { Component, inject, Input } from '@angular/core';
import { IGetByTokenUser } from '../../../../../interfaces/iuser.interface';
import { initCourse, initUser } from '../../../../../shared/utils/initializers';
import { UsersService } from '../../../../../services/users.service';
import { CoursesService } from '../../../../../services/courses.service';
import { ICourse } from '../../../../../interfaces/icourse.interface';
import { CourseFormComponent } from '../../courses-grid/components/course-form/course-form.component';
import { environment } from '../../../../../environments/environment.test';

@Component({
  selector: 'app-course-home',
  imports: [CourseFormComponent],
  templateUrl: './course-home.component.html',
  styleUrl: './course-home.component.css',
})
export class CourseHomeComponent {
  usersService = inject(UsersService);
  coursesService = inject(CoursesService);

  course_image_endpoint = `${environment.host}/uploads/courses/`;

  @Input() course_uuid: string = '';

  user: IGetByTokenUser = initUser();
  course: ICourse = initCourse();

  showCourseForm = false;

  async updateGrid() {
    this.showCourseForm = false;
    try {
      this.course = await this.coursesService.getByUuid(this.course_uuid);
    } catch (error) {
      return;
    }
  }

  async loadCourse() {
    try {
      this.course = await this.coursesService.getByUuid(this.course_uuid);
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    }
  }

  async ngOnInit() {
  try {
    this.user = await this.usersService.getByToken();
    await this.updateGrid();
    this.loadCourse();
    console.log(this.course.planning)
  } catch (error) {
    return;
  }
  }
}
