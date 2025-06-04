import { Component } from '@angular/core';
import { CodeConfirmationComponent } from '../../../shared/components/code-confirmation/code-confirmation.component';

@Component({
  selector: 'app-change-password-confirmation',
  imports: [CodeConfirmationComponent],
  templateUrl: './change-password-confirmation.component.html',
  styleUrl: './change-password-confirmation.component.css',
})
export class ChangePasswordConfirmationComponent {}
