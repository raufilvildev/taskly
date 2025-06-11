import { Component, inject } from '@angular/core';
import { AuthorizationService } from '../../../services/authorization.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password-email-request',
  imports: [FormsModule],
  templateUrl: './change-password-email-request.component.html',
  styleUrl: './change-password-email-request.component.css',
})
export class ChangePasswordEmailRequestComponent {
  authorizationService = inject(AuthorizationService);
  router = inject(Router);

  async checkEmail(email: any) {
    console.log(email.value);
    try {
      let response = await this.authorizationService.checkEmail(email.value);
      if (response.token) {
        this.authorizationService.requestConfirmationByEmail(response.token, 'change_password');
        this.router.navigate(['/login/change_password']);
      } else {
        console.log('No hemos encontrado este usuario');
      }
    } catch (msg: any) {
      console.log(msg);
    }
  }
}
