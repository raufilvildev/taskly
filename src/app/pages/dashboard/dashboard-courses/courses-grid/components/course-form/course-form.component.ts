import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IGetByTokenUser } from '../../../../../../interfaces/iuser.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICourse, IUnitCourse } from '../../../../../../interfaces/icourse.interface';
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

  courseForm = new FormGroup({
    uuid: new FormControl(''),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    course_image_url: new FormControl(''),
    teacher: new FormControl(''),
  });

  plannning: IUnitCourse[] = [];

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

    try {
      await this.coursesService.create(courseForm.value);
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

  editCourse(courseForm: FormGroup) {}

  cancelCourseForm() {
    this.cancel.emit();
  }

  ngOnInit() {
    if (this.type === 'edit') {
      this.courseForm = new FormGroup({
        uuid: new FormControl(this.course.uuid, Validators.required),
        title: new FormControl(this.course.title, Validators.required),
        description: new FormControl(this.course.description, Validators.required),
        course_image_url: new FormControl(this.course.course_image_url, Validators.required),
        teacher: new FormControl(this.user.uuid, Validators.required),
      });
    }
  }
}
