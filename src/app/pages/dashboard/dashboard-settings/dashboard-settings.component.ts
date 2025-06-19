import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { IGetByTokenUser } from '../../../interfaces/iuser.interface';
import { constants } from '../../../shared/utils/constants/constants.config';
import { initUser } from '../../../shared/utils/initializers';
import { UserFieldsetComponent } from './components/user-fieldset/user-fieldset.component';
import dayjs from 'dayjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-settings',
  imports: [ReactiveFormsModule, FormsModule, UserFieldsetComponent],
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.css'],
})
export class DashboardSettingsComponent {
  private usersService = inject(UsersService);
  private authorizationService = inject(AuthorizationService);
  router = inject(Router);

  serverError = '';
  serverSuccess = '';
  user: IGetByTokenUser = initUser();

  userSettingsForm = new FormGroup({
    first_name: new FormControl('', [Validators.minLength(2), Validators.maxLength(100)]),
    last_name: new FormControl('', [Validators.minLength(2), Validators.maxLength(100)]),
    birth_date: new FormControl(''),
    username: new FormControl('', [Validators.minLength(2), Validators.maxLength(100)]),
  });

  editUserForm: { [key: string]: boolean } = {
    first_name: false,
    last_name: false,
    username: false,
    birth_date: false,
  };

  updateUserFormState(field: string | null) {
    const resetFormState: { [key: string]: boolean } = {
      first_name: false,
      last_name: false,
      username: false,
      birth_date: false,
    };

    if (field) {
      resetFormState[field] = true;
    }

    this.editUserForm = { ...resetFormState };
  }

  async updateUser(userFormValue?: any) {
    try {
      if (userFormValue) {
        await this.usersService.update(userFormValue);
      }

      this.user = await this.usersService.getByToken();

      const birthDateFormatted = this.user.birth_date
        ? dayjs(this.user.birth_date).format('YYYY-MM-DD')
        : '';

      this.userSettingsForm.patchValue({
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        birth_date: birthDateFormatted,
        username: this.user.username,
      });

      const birthDate = this.user.birth_date
        ? dayjs(this.user.birth_date).format('DD/MM/YYYY')
        : '';

      this.user.birth_date = birthDate;

      for (const key in this.editUserForm) {
        this.editUserForm[key] = false;
      }
    } catch (error) {
      console.error(`Error al actualizar el usuario:`, error);
    }
  }

  onSaveField(event: { controlName: string; value: string | Date }): void {
    const { controlName, value } = event;
    this.userSettingsForm.get(controlName)?.setValue(value);
    this.updateUser(this.userSettingsForm.value);
  }

  async ngOnInit() {
    await this.updateUser();
  }
}
