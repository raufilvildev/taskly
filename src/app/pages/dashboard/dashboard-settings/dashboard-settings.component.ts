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

@Component({
  selector: 'app-dashboard-settings',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.css'],
})
export class DashboardSettingsComponent {
  private usersService = inject(UsersService);
  private authorizationService = inject(AuthorizationService);

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
    const token = this.authorizationService.getToken();
    try {
      this.user = await this.usersService.getByToken(token);
      this.userSettingsForm = new FormGroup({
        first_name: new FormControl(this.user.first_name, [
          Validators.minLength(2),
          Validators.maxLength(100),
        ]),
        last_name: new FormControl(this.user.last_name, [
          Validators.minLength(2),
          Validators.maxLength(100),
        ]),
        birth_date: new FormControl(this.user.birth_date as string),
        username: new FormControl(this.user.username, [
          Validators.minLength(2),
          Validators.maxLength(100),
        ]),
      });
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

  updateUserFormState(field: string, state: boolean) {
    this.editUserForm[field] = state;
  }

  async updateUser(userFormValue: any) {
    try {
      const token = this.authorizationService.getToken();
      const responseData = await this.usersService.update(token, userFormValue);
      await this.ngOnInit();
      for (const key in this.editUserForm) {
        this.editUserForm[key] = false;
      }
    } catch (error) {
      console.error(`Error al actualizar el usuario:`, error);
    }
  }
}
