import { Component, inject } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../services/authorization.service';
import { UsersService } from '../../../services/users.service';
import { passwordsMatchValidator } from '../../../validators/passwords_match.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from '../../../shared/utils/constants/constants.config';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  router = inject(Router);
  authorizationService = inject(AuthorizationService);
  usersService = inject(UsersService);

  passwordError = '';
  isVisiblePassword = false;

  changePasswordForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'),
    ]),
    password_confirmation: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'),
    ]),
  });

  getValidationStyleClasses(control_name: string, errors: string[]) {
    let hasErrors: boolean = false;

    if (this.changePasswordForm.get(control_name)?.touched) {
      hasErrors = errors.some((error) =>
        this.changePasswordForm.get(control_name)?.hasError(error)
      );
    }

    if (['password', 'password_confirmation'].includes(control_name)) {
      const result: ValidationErrors | null = passwordsMatchValidator(this.changePasswordForm);

      if (
        result &&
        this.changePasswordForm.get('password')?.touched &&
        this.changePasswordForm.get('password_confirmation')?.touched
      ) {
        hasErrors = true;
      }
    }
    const isValid = this.changePasswordForm.get(control_name)?.valid && !hasErrors;

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
        this.changePasswordForm.get(control_name)?.touched &&
        this.changePasswordForm.get(control_name)?.hasError(error)
      ) {
        errors.push(`El campo ${constants.fields[control_name]} ${constants.messages[error]}.`);
      }
    }

    return errors;
  }

  async changePassword() {
    try {
      if (passwordsMatchValidator(this.changePasswordForm) === null) {
        const password = this.changePasswordForm.value.password as string;
        await this.usersService.changePassword(password);
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      } else {
        this.passwordError = 'Las contraseñas no coinciden';
      }
    } catch (errorResponse) {
      this.authorizationService.removeToken();
      if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
        this.passwordError = constants.generalServerError;
        return;
      }
      if (errorResponse instanceof HttpErrorResponse) {
        this.passwordError = errorResponse.error;
        return;
      }

      this.passwordError = constants.generalServerError;
    }
  }
}
