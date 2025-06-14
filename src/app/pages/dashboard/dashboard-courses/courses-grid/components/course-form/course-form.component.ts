import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IGetByTokenUser } from '../../../../../../interfaces/iuser.interface';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICourse, IUnitCourse } from '../../../../../../interfaces/icourse.interface';
import { initCourse, initUser } from '../../../../../../shared/utils/initializers';
import { CoursesService } from '../../../../../../services/courses.service';
import { AuthorizationService } from '../../../../../../services/authorization.service';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from '../../../../../../shared/utils/constants/constants.config';
import { CreateEditCancelRemoveButtonComponent } from '../../../../../../shared/components/buttons/create-edit-remove-button/create-edit-cancel-remove-button.component';

type UnitFormGroup = FormGroup<{
  title: FormControl<string | null>;
  sections: FormArray<FormControl<string | null>>;
}>;

@Component({
  selector: 'app-course-form',
  imports: [ReactiveFormsModule, CreateEditCancelRemoveButtonComponent],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css',
})
export class CourseFormComponent {
  authorizationService = inject(AuthorizationService);
  coursesService = inject(CoursesService);

  @Input() user: IGetByTokenUser = initUser();
  @Input() type: 'create' | 'edit' = 'create';
  @Input() course: ICourse = initCourse();

  @Output() cancel = new EventEmitter<void>();

  courseFormError = '';
  units: IUnitCourse[] = [];
  token = '';

  courseForm = new FormGroup({
    uuid: new FormControl(''),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    course_image_url: new FormControl(''),
    teacher: new FormControl(''),
    planning: new FormArray<FormGroup>([]),
  });

  async createCourse(courseForm: FormGroup) {
    this.courseFormError = '';

    if (courseForm.invalid) {
      this.courseFormError = 'Existen campos vacíos.';
      return;
    }

    try {
      await this.coursesService.create(this.token, courseForm.value);
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

  get planning(): FormArray<UnitFormGroup> {
    return this.courseForm.get('planning') as FormArray;
  }

  createUnit() {
    const unitForm: UnitFormGroup = new FormGroup({
      title: new FormControl('', Validators.required),
      sections: new FormArray<FormControl<string | null>>([]),
    });
    this.planning.push(unitForm);
  }

  removeUnit(index: number) {
    this.planning.removeAt(index);
  }

  createSection(unitIndex: number) {
    const unit = this.planning.at(unitIndex);
    unit.controls.sections.push(new FormControl('', Validators.required));
  }

  removeSection(unitIndex: number, sectionIndex: number) {
    const unit = this.planning.at(unitIndex);
    unit.controls.sections.removeAt(sectionIndex);
  }

  ngOnInit() {
    this.token = this.authorizationService.getToken();
    if (this.type === 'edit') {
      this.courseForm = new FormGroup({
        uuid: new FormControl(this.course.uuid, Validators.required),
        title: new FormControl(this.course.title, Validators.required),
        description: new FormControl(this.course.description, Validators.required),
        course_image_url: new FormControl(this.course.course_image_url, Validators.required),
        teacher: new FormControl(this.user.uuid, Validators.required),
        planning: new FormArray<UnitFormGroup>([]),
      });
    }
  }
}
