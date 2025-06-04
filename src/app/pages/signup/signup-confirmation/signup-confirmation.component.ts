import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { IUser } from '../../../interfaces/iuser.interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from '../../../shared/utils/constants/constants.config';

@Component({
  selector: 'app-signup-confirmation',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-confirmation.component.html',
  styleUrl: './signup-confirmation.component.css',
})
export class SignupConfirmationComponent {
  router = inject(Router);
  usersService = inject(UsersService);
  authorizationService = inject(AuthorizationService);
  user?: IUser;

  confirmEmailFormError = '';
  serverError = '';

  confirmEmailForm = new FormGroup({
    random_number_input: new FormControl(''),
  });

  async confirmEmail(confirmEmailForm: FormGroup) {
    const { random_number_input } = confirmEmailForm.value;
    let token = localStorage.getItem('token') as string;
    try {
      const result = await this.authorizationService.checkRandomNumberInput(
        token,
        random_number_input
      );
      token = result.token;
      localStorage.setItem('token', token);
      this.router.navigate(['dashboard']);
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
        this.serverError = constants.generalServerError;
        return;
      }
      if (errorResponse instanceof HttpErrorResponse) {
        this.confirmEmailFormError = errorResponse.error;
        return;
      }

      this.serverError = constants.generalServerError;
    }
  }

  generateRandomNumber() {}

  async ngOnInit() {
    const token: string | null = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/home']);
      return;
    }

    try {
      this.user = await this.usersService.getById(token);
      if (this.user.email_confirmed) {
        this.router.navigate(['dashboard']);
      }
    } catch (error) {
      localStorage.removeItem('token');
      this.router.navigate(['/home']);
    }
  }
}
