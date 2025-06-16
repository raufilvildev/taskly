import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IStudent } from '../../../../../../interfaces/icourse.interface';
import { CreateEditCancelRemoveButtonComponent } from '../../../../../../shared/components/buttons/create-edit-cancel-remove-button/create-edit-cancel-remove-button.component';
import { initStudent } from '../../../../../../shared/utils/initializers';
import { UsersService } from '../../../../../../services/users.service';

@Component({
  selector: 'app-students-search-form',
  imports: [ReactiveFormsModule, CreateEditCancelRemoveButtonComponent],
  templateUrl: './students-search-form.component.html',
  styleUrl: './students-search-form.component.css',
})
export class StudentsSearchFormComponent {
  usersService = inject(UsersService);

  @Output() updateStudents = new EventEmitter<IStudent[]>();

  studentsSearchForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  student: IStudent = initStudent();

  students: IStudent[] = [];

  showResult = false;
  studentsSearchFormError = '';

  async searchStudentByEmail() {
    if (this.studentsSearchForm.invalid) {
      this.studentsSearchFormError = 'El formato del correo electrónico es incorrecto.';
      return;
    }

    this.studentsSearchFormError = '';

    try {
      const { email } = this.studentsSearchForm.value;
      this.student = await this.usersService.getByEmail(email || '');
    } catch (error: any) {
      this.studentsSearchFormError = error;
    }

    this.showResult = true;
  }

  addStudent(student: IStudent) {
    this.students.push(student);
    this.updateStudents.emit(this.students);
  }

  removeStudent(student_uuid: string) {
    this.students = this.students.filter((student) => student.uuid !== student_uuid);
    this.updateStudents.emit(this.students);
  }
}
