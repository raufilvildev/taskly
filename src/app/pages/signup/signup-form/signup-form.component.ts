import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import type { ISignupUser, IUser } from '../../../interfaces/iuser.interface';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../services/authorization.service';
import { passwordsMatchValidator } from '../../../validators/passwords_match.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from '../../../shared/utils/constants/constants.config';

@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css',
})
export class SignupFormComponent {
  usersService = inject(UsersService);
  authorizationService = inject(AuthorizationService);
  router = inject(Router);

  isVisiblePassword = false;
  serverError = '';

  signupForm = new FormGroup(
    {
      first_name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      last_name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      birth_date: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'),
      ]),
      password_confirmation: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'),
      ]),
      role: new FormControl('', []),
    },
    passwordsMatchValidator
  );

  getValidationStyleClasses(control_name: string, errors: string[]) {
    if (
      ![
        'first_name',
        'last_name',
        'birth_date',
        'email',
        'username',
        'password',
        'password_confirmation',
      ].includes(control_name) ||
      errors.some(
        (error) =>
          !['required', 'minlength', 'maxlength', 'email', 'pattern', 'passwordMismatch'].includes(
            error
          )
      )
    ) {
      return {};
    }
    let hasErrors: boolean = false;

    if (this.signupForm.get(control_name)?.touched) {
      hasErrors = errors.some((error) => this.signupForm.get(control_name)?.hasError(error));
    }

    if (['password', 'password_confirmation'].includes(control_name)) {
      const result: ValidationErrors | null = passwordsMatchValidator(this.signupForm);

      if (
        result &&
        this.signupForm.get('password')?.touched &&
        this.signupForm.get('password_confirmation')?.touched
      ) {
        hasErrors = true;
      }
    }

    const isValid = this.signupForm.get(control_name)?.valid && !hasErrors;

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
        this.signupForm.get(control_name)?.touched &&
        this.signupForm.get(control_name)?.hasError(error)
      ) {
        errors.push(`El campo ${constants.fields[control_name]} ${constants.messages[error]}.`);
      }
    }

    return errors;
  }

  async signup(signupForm: FormGroup) {
    signupForm.value.role = signupForm.value.role ? 'teacher' : 'general';

    this.serverError = '';

    signupForm.markAllAsTouched();

    if (signupForm.valid) {
      const { first_name, last_name, birth_date, email, username, password, role } =
        signupForm.value;
      const user: ISignupUser = {
        first_name,
        last_name,
        birth_date,
        email,
        username,
        password,
        role,
      };

      let token = '';

      try {
        const createResult = await this.usersService.create(user);
        token = createResult.token;

        this.authorizationService.setToken(token);
        const { message } = await this.authorizationService.requestConfirmationByEmail('signup');
        this.router.navigate(['signup', 'signup_confirmation']);
      } catch (errorResponse) {
        if (token) {
          await this.usersService.remove();
          this.authorizationService.removeToken();
        }

        if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
          this.serverError = constants.generalServerError;
          return;
        }

        if (errorResponse instanceof HttpErrorResponse) {
          this.serverError = errorResponse.error;
          return;
        }

        this.serverError = constants.generalServerError;
      }
    }
  }
}
