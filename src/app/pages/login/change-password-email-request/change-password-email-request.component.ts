import { Component, inject } from '@angular/core';
import { AuthorizationService } from '../../../services/authorization.service';

@Component({
  selector: 'app-change-password-email-request',
  imports: [],
  templateUrl: './change-password-email-request.component.html',
  styleUrl: './change-password-email-request.component.css',
})
export class ChangePasswordEmailRequestComponent {
  authorizationService = inject(AuthorizationService)

  
}
