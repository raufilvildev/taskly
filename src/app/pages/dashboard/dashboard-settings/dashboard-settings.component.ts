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

// Pon las propiedades del componente arriba, junto a los Inputs/Outputs y las inyecciones (mi orden es inyección - Input/Output - propiedad al uso)
// Tus funciones deberían ir antes del ngOnInit().
// La función updateUser() debe tener la lógica de ngOnInit() y en ngOnInit() ejecutar updateUser() y no al contrario.
// IMPORTANTE: HACER TESTS

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

  getValidationStyleClasses(control_name: string, errors: string[]) {
    if (
      !['first_name', 'last_name', 'birth_date', 'username'].includes(control_name) ||
      errors.some((error) => !['minlength', 'maxlength'].includes(error))
    ) {
      return {};
    }
    let hasErrors: boolean = false;

    if (this.userSettingsForm.get(control_name)?.touched) {
      hasErrors = errors.some((error) => this.userSettingsForm.get(control_name)?.hasError(error));
    }

    const isValid = this.userSettingsForm.get(control_name)?.valid && !hasErrors;

    return {
      'border-custom-error': hasErrors,
      'bg-red-100': hasErrors,
      'hover:border-custom-error': hasErrors,
      'focus:outline-custom-error': hasErrors,
      'focus:shadow-custom-error': hasErrors,
      'border-custom-success': isValid,
      'hover:border-custom-success': isValid,
      'focus:outline-custom-success': isValid,
      'focus:shadow-custom-success': isValid,
    };
  }

  getErrors(control_name: string) {
    const errors: string[] = [];

    for (const error in constants.messages) {
      if (
        this.userSettingsForm.get(control_name)?.touched &&
        this.userSettingsForm.get(control_name)?.hasError(error)
      ) {
        errors.push(`El campo ${constants.fields[control_name]} ${constants.messages[error]}.`);
      }
    }

    return errors;
  }

  async ngOnInit() {
    try {
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
    } catch (error) {
      return;
    }
  }

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

  async updateUser(userFormValue: any) {
    try {
      const responseData = await this.usersService.update(userFormValue);
      await this.ngOnInit();
      for (const key in this.editUserForm) {
        this.editUserForm[key] = false;
      }
    } catch (error) {
      console.error(`Error al actualizar el usuario:`, error);
    }
  }
}
