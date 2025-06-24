import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IStudent } from '../../../../../../interfaces/icourse.interface';
import { CreateEditCancelRemoveButtonComponent } from '../../../../../../shared/components/buttons/create-edit-cancel-remove-button/create-edit-cancel-remove-button.component';
import { initStudent } from '../../../../../../shared/utils/initializers';
import { UsersService } from '../../../../../../services/users.service';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../../../services/theme.service';
import { environment } from '../../../../../../environments/environment.test';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-students-search-form',
  imports: [ReactiveFormsModule, CreateEditCancelRemoveButtonComponent, MatIcon],
  templateUrl: './students-search-form.component.html',
  styleUrl: './students-search-form.component.css',
})
export class StudentsSearchFormComponent {
  usersService = inject(UsersService);
  themeService = inject(ThemeService);

  @Input() students: IStudent[] = [];
  @Output() updateStudents = new EventEmitter<IStudent[]>();

  studentsSearchForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  private themeSub?: Subscription;

  student: IStudent = initStudent();
  profile_image_endpoint = `${environment.host}/uploads/users/`;

  showResult = false;
  studentsSearchFormError = '';
  isDarkMode = signal(false);

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
      this.studentsSearchFormError = ' ';
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

  checkStudentExistsOnStudents(student_uuid: string) {
    const student = this.students.find((student) => student.uuid === student_uuid);
    return !student ? false : true;
  }

  async ngOnInit() {
    // Inicializa el valor del tema actual
    this.isDarkMode.set(this.themeService.currentValue);

    // Suscríbete al observable para actualizar el signal cuando el tema cambie
    this.themeSub = this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode.set(isDark);
    });
  }

  ngOnDestroy() {
    // Cancelar suscripción para evitar memory leaks
    this.themeSub?.unsubscribe();
  }
}
