import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../services/authorization.service';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  router = inject(Router)
  authorizationService = inject(AuthorizationService)

  

}
