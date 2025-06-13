import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUser } from '../../../../../../interfaces/iuser.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICourse } from '../../../../../../interfaces/icourse.interface';

@Component({
  selector: 'app-course-form',
  imports: [ReactiveFormsModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css',
})
export class CourseFormComponent {
  @Input() user?: IUser;
  @Input() type: 'create' | 'edit' = 'create';
  @Input() course?: ICourse;

  @Output() cancel = new EventEmitter<void>();

  courseFormError = '';

  courseForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });

  createCourse(courseForm: FormGroup) {}

  editCourse(courseForm: FormGroup) {}

  cancelCourseForm() {
    this.cancel.emit();
  }

  ngOnInit() {
    if (this.type === 'edit') {
      this.courseForm = new FormGroup({
        title: new FormControl(this.course?.title || '', Validators.required),
        description: new FormControl(this.course?.description || '', Validators.required),
      });
    }
  }
}
