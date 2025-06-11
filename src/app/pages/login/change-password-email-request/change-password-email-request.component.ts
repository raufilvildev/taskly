import { Component, inject } from '@angular/core';
import { AuthorizationService } from '../../../services/authorization.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from '../../../shared/utils/constants/constants.config';

@Component({
  selector: 'app-change-password-email-request',
  imports: [FormsModule],
  templateUrl: './change-password-email-request.component.html',
  styleUrl: './change-password-email-request.component.css',
})
export class ChangePasswordEmailRequestComponent {
  authorizationService = inject(AuthorizationService);
  router = inject(Router);

  emailRequestError = '';

  async checkEmail(emailRequest: any) {
    const { email } = emailRequest.value;

    try {
      const { token } = await this.authorizationService.checkEmail(email);
      await this.authorizationService.requestConfirmationByEmail(token, 'change_password');

      this.authorizationService.setToken(token);

      this.router.navigate(['/login/change_password_confirmation']);
    } catch (errorResponse) {
      this.authorizationService.removeToken();
      localStorage.removeItem('token');
      if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
        this.emailRequestError = constants.generalServerError;
        return;
      }
      if (errorResponse instanceof HttpErrorResponse) {
        this.emailRequestError = errorResponse.error;
        return;
      }

      this.emailRequestError = constants.generalServerError;
    }
  }
}
