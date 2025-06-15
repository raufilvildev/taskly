import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from '../../../shared/utils/constants/constants.config';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  usersService = inject(UsersService);
  router = inject(Router);
  authorizationService = inject(AuthorizationService);

  isVisiblePassword = false;
  loginError = '';

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'),
    ]),
  });

  getValidationStyleClasses(control_name: string, errors: string[]) {
    let hasErrors: boolean = false;

    if (this.loginForm.get(control_name)?.touched) {
      hasErrors = errors.some((error) => this.loginForm.get(control_name)?.hasError(error));
    }

    const isValid = this.loginForm.get(control_name)?.valid && !hasErrors;

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
        this.loginForm.get(control_name)?.touched &&
        this.loginForm.get(control_name)?.hasError(error)
      ) {
        errors.push(`El campo ${constants.fields[control_name]} ${constants.messages[error]}.`);
      }
    }

    return errors;
  }

  async getLogin(loginForm: FormGroup) {
    let token = '';

    try {
      if (this.loginForm.value.username !== '' && this.loginForm.value.password !== '') {
        const { token } = await this.usersService.login(loginForm.value);
        this.authorizationService.setToken(token);
        this.router.navigate(['/dashboard']);
      } else {
        this.loginError = 'Usuario o contraseña incorrectos';
      }
    } catch (errorResponse) {
      if (token) {
        this.usersService.remove();
        this.authorizationService.removeToken();
      }

      if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
        this.loginError = constants.generalServerError;
        return;
      }
      if (errorResponse instanceof HttpErrorResponse) {
        this.loginError = errorResponse.error;
        return;
      }

      this.loginError = constants.generalServerError;
    }
  }
}
