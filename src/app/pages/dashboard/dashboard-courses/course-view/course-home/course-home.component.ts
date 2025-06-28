import { Component, inject, Input } from '@angular/core';
import { IGetByTokenUser } from '../../../../../interfaces/iuser.interface';
import { initCourse, initUser } from '../../../../../shared/utils/initializers';
import { UsersService } from '../../../../../services/users.service';
import { CoursesService } from '../../../../../services/courses.service';
import { ICourse } from '../../../../../interfaces/icourse.interface';
import { CourseFormComponent } from '../../courses-grid/components/course-form/course-form.component';
import { environment } from '../../../../../environments/environment.test';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-course-home',
  imports: [CourseFormComponent, MatIconModule],
  templateUrl: './course-home.component.html',
  styleUrl: './course-home.component.css',
})
export class CourseHomeComponent {
  usersService = inject(UsersService);
  coursesService = inject(CoursesService);
  router = inject(Router);
  showDownloadPdf: boolean = false;

  course_image_endpoint = `${environment.host}/uploads/courses/`;

  @Input() course_uuid: string = '';

  user: IGetByTokenUser = initUser();
  course: ICourse = initCourse();

  showCourseForm = false;
  showDeleteConfirmation = false;
  deleteCourseError = '';

  async updateGrid() {
    this.showCourseForm = false;
    try {
      this.course = await this.coursesService.getByUuid(this.course_uuid);
    } catch (error) {
      return;
    }
  }

  async exportPdfViewCourse() {
    try {
      const pdfBlob = await this.coursesService.exportPdfViewCourse(this.course_uuid);
      saveAs(pdfBlob, `informe-del-curso.pdf`);
      this.showDownloadPdf = false;
    } catch (error) {
      console.log(error);
    }
  }

  async loadCourse() {
    try {
      this.course = await this.coursesService.getByUuid(this.course_uuid);
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    }
  }

  async deleteCourse() {
    this.deleteCourseError = '';
    try {
      await this.coursesService.delete(this.course_uuid);
      this.router.navigate(['/dashboard', 'courses']);
    } catch (error: any) {
      this.deleteCourseError =
        'Ha ocurrido un error inesperado al eliminar el curso. Por favor, inténtalo de nuevo más tarde.';
    }
  }

  async ngOnInit() {
    try {
      this.user = await this.usersService.getByToken();
      await this.updateGrid();
      this.loadCourse();
      console.log(this.course.planning);
    } catch (error) {
      return;
    }
  }
}
