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
import { HttpErrorResponse } from '@angular/common/http';

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
    first_name: new FormControl('', [Validators.minLength(3), Validators.maxLength(100)]),
    last_name: new FormControl('', [Validators.minLength(3), Validators.maxLength(100)]),
    birth_date: new FormControl(''),
    username: new FormControl('', [Validators.minLength(3), Validators.maxLength(100)]),
  });

  files: File[] = [];
  private originalImageName = '';
  userImageUrl: string = '';

  editUserForm: { [key: string]: boolean } = {
    first_name: false,
    last_name: false,
    username: false,
    birth_date: false,
  };

  formattedBirthDate: string="";

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

  async updateUser() {
    this.serverError = '';
    try {
      const formData = new FormData();
      formData.append('first_name', this.userSettingsForm.value.first_name ?? '');
      formData.append('last_name', this.userSettingsForm.value.last_name ?? '');
      formData.append('username', this.userSettingsForm.value.username ?? '');
      formData.append('birth_date', this.userSettingsForm.value.birth_date ?? '');

      if (this.files.length > 0) {
        formData.append('profile-image', this.files[0]);
      } else {
        formData.append('profile_image_url', this.originalImageName || 'default_user_profile.svg');
      }

      await this.usersService.update(formData);
      await this.loadUser();

      for (const key in this.editUserForm) {
        this.editUserForm[key] = false;
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 0) {
        this.serverError = constants.generalServerError;
      } else if (error instanceof HttpErrorResponse) {
        this.serverError = error.error;
      }
    }
  }

  async loadUser() {
    try {
      this.user = await this.usersService.getByToken();

      const fullUrl = this.user.profile_image_url;
      const filename = fullUrl.split('/').pop() ?? '';

      this.formattedBirthDate = this.user.birth_date
      ? dayjs(this.user.birth_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
      : '';

      this.originalImageName = filename;

      this.userImageUrl = `http://localhost:3000/uploads/users/${filename}`;

      // El formulario espera 'YYYY-MM-DD', pero puedes mostrar 'DD/MM/YYYY' en la vista usando un pipe personalizado en el template.
      this.userSettingsForm.patchValue({
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        username: this.user.username,
        birth_date: this.user.birth_date ? dayjs(this.user.birth_date).format('YYYY-MM-DD') : '',
      });
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    }
  }

  onSaveField(event: { controlName: string; value: string | Date }): void {
    const { controlName, value } = event;
    this.userSettingsForm.get(controlName)?.setValue(value);
    this.updateUser();
  }

  async ngOnInit() {
    await this.loadUser();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files = Array.from(input.files);
      this.updateUser();
    }
  }
}
