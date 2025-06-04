import { Component } from '@angular/core';
import { CodeConfirmationComponent } from '../../../shared/components/code-confirmation/code-confirmation.component';

@Component({
  selector: 'app-signup-confirmation',
  imports: [CodeConfirmationComponent],
  templateUrl: './signup-confirmation.component.html',
  styleUrl: './signup-confirmation.component.css',
})
export class SignupConfirmationComponent {}
