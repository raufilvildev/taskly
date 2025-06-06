import { Component, inject, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { IUser } from '../../../interfaces/iuser.interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from '../../../shared/utils/constants/constants.config';
import { CountdownComponent, CountdownModule } from 'ngx-countdown';

@Component({
  selector: 'app-code-confirmation',
  imports: [ReactiveFormsModule, CountdownModule],
  templateUrl: './code-confirmation.component.html',
  styleUrl: './code-confirmation.component.css',
})
export class CodeConfirmationComponent {
  router = inject(Router);
  usersService = inject(UsersService);
  authorizationService = inject(AuthorizationService);

  @Input() type = 'signup';

  user?: IUser;

  confirmEmailFormError = '';
  serverError = '';

  config = { leftTime: 300, format: 'mm:ss' };
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent | undefined;

  confirmEmailForm = new FormGroup({
    random_number_input: new FormControl(''),
  });

  async confirmEmail(confirmEmailForm: FormGroup) {
    this.confirmEmailFormError = '';
    this.serverError = '';

    const { random_number_input } = confirmEmailForm.value;

    if (!random_number_input) {
      this.confirmEmailFormError = 'El código no puede ser vacío.';
      return;
    }

    let token = localStorage.getItem('token') as string;
    try {
      const result = await this.authorizationService.checkRandomNumberInput(
        token,
        random_number_input
      );
      token = result.token;
      localStorage.setItem('token', token);

      if (this.type === 'signup') {
        this.router.navigate(['dashboard']);
        return;
      }

      this.router.navigate(['login', 'change_password']);
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
  async resetRandomNumber() {
    const token = this.authorizationService.getToken() as string;

    this.countdown?.restart();

    setTimeout(async () => {
      const { message } = await this.authorizationService.resetRandomNumber(token);
    }, 300000);
  }

  async generateRandomNumber() {
    const token = this.authorizationService.getToken() as string;

    try {
      const { message } = await this.authorizationService.requestConfirmationByEmail(
        token,
        this.type
      );
      this.resetRandomNumber();
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

  async ngOnInit() {
    this.resetRandomNumber();
  }
}
