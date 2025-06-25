import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IGetByTokenUser } from '../../../../../../interfaces/iuser.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICourse, IStudent, IUnitCourse } from '../../../../../../interfaces/icourse.interface';
import { initCourse, initUser } from '../../../../../../shared/utils/initializers';
import { CoursesService } from '../../../../../../services/courses.service';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from '../../../../../../shared/utils/constants/constants.config';
import { UnitFormComponent } from '../unit-form/unit-form.component';
import { StudentsSearchFormComponent } from '../students-search-form/students-search-form.component';

@Component({
  selector: 'app-course-form',
  imports: [ReactiveFormsModule, UnitFormComponent, StudentsSearchFormComponent],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css',
})
export class CourseFormComponent {
  coursesService = inject(CoursesService);

  @Input() user: IGetByTokenUser = initUser();
  @Input() type: 'create' | 'edit' = 'create';
  @Input() course: ICourse = initCourse();

  @Output() cancel = new EventEmitter<void>();
  @Output() closeCourseForm = new EventEmitter<void>();

  courseForm = new FormGroup({
    uuid: new FormControl(''),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  planning: IUnitCourse[] = [];
  students: IStudent[] = [];
  files: File[] = [];

  sectionForm = new FormGroup({
    title: new FormControl('', Validators.required),
  });

  courseFormError = '';
  units: IUnitCourse[] = [];
  studentsSearchFormError = '';
  unitFormError = '';

  async createCourse(courseForm: FormGroup) {
    this.courseFormError = '';

    if (courseForm.invalid) {
      this.courseFormError = 'Existen campos vacíos.';
      return;
    }
    const { title, description } = this.courseForm.value;

    const formData = new FormData();

    formData.append('title', title || '');
    formData.append('description', description || '');
    formData.append('teacher', this.user.uuid);
    formData.append('students', JSON.stringify(this.students));
    formData.append('planning', JSON.stringify(this.planning));
    formData.append('course-image', this.files[0]);

    try {
      await this.coursesService.create(formData);
      this.closeCourseForm.emit();
    } catch (errorResponse) {
      console.log(errorResponse);
      if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
        this.courseFormError = constants.generalServerError;
        return;
      }

      if (errorResponse instanceof HttpErrorResponse) {
        this.courseFormError = errorResponse.error;
        return;
      }

      this.courseFormError = constants.generalServerError;
    }
  }

  async editCourse(courseForm: FormGroup) {
    this.courseFormError = '';

    if (courseForm.invalid) {
      this.courseFormError = 'Existen campos vacíos.';
      return;
    }
    const { title, description } = this.courseForm.value;

    const formData = new FormData();

    formData.append('uuid', this.course.uuid);
    formData.append('title', title || '');
    formData.append('description', description || '');
    formData.append('teacher', this.user.uuid);
    formData.append('students', JSON.stringify(this.students));
    formData.append('planning', JSON.stringify(this.planning));
    formData.append('course_image_url', !this.files[0] ? this.course.course_image_url : '');
    formData.append('course-image', this.files[0]);

    try {
      await this.coursesService.edit(formData);
      this.closeCourseForm.emit();
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
        this.courseFormError = constants.generalServerError;
        return;
      }

      if (errorResponse instanceof HttpErrorResponse) {
        this.courseFormError = errorResponse.error;
        return;
      }

      this.courseFormError = constants.generalServerError;
    }
  }

  cancelCourseForm() {
    this.cancel.emit();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files = Array.from(input.files);
    }
  }

  ngOnInit() {
    if (this.type === 'edit') {
      this.courseForm = new FormGroup({
        uuid: new FormControl(this.course.uuid, Validators.required),
        title: new FormControl(this.course.title, Validators.required),
        description: new FormControl(this.course.description, Validators.required),
      });

      // Copia profunda para evitar que en course-home se actualice los datos antes de confirmar la edición.

      this.students = JSON.parse(JSON.stringify(this.course.students));
      this.planning = JSON.parse(JSON.stringify(this.course.planning));
    }
  }
}
