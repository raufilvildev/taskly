import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IStudent } from '../../../../../../interfaces/icourse.interface';
import { CreateEditCancelRemoveButtonComponent } from '../../../../../../shared/components/buttons/create-edit-cancel-remove-button/create-edit-cancel-remove-button.component';

@Component({
  selector: 'app-students-search-form',
  imports: [ReactiveFormsModule, CreateEditCancelRemoveButtonComponent],
  templateUrl: './students-search-form.component.html',
  styleUrl: './students-search-form.component.css',
})
export class StudentsSearchFormComponent {
  studentsSearchForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  student: IStudent = {
    uuid: '1',
    first_name: 'Raúl',
    last_name: 'Filigrana Villalba',
    email: 'raufilvil@gmail.com',
    username: 'raufilvil',
    profile_image_url: 'default_user_profile.svg',
  };

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
      const email = this.studentsSearchForm.value;
    } catch (error: any) {
      this.studentsSearchFormError = error;
    }

    this.showResult = true;
  }

  addStudent(student: IStudent) {
    this.students.push(student);
  }

  removeStudent(student_uuid: string) {
    this.students = this.students.filter((student) => student.uuid !== student_uuid);
  }
}
