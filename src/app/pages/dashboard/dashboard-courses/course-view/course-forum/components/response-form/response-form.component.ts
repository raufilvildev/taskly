import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../../../../../../interfaces/iuser.interface';

@Component({
  selector: 'app-response-form',
  imports: [ReactiveFormsModule],
  templateUrl: './response-form.component.html',
  styleUrl: './response-form.component.css',
})
export class ResponseFormComponent {
  responseForm = new FormGroup({
    content: new FormControl('', Validators.required),
  });
  @Input() user!: IUser;

  type = 'create';

  cancelResponseForm() {}
  createResponse(responseForm: FormGroup) {}

  editResponse(responseForm: FormGroup) {}

  deleteResponse(responseForm: FormGroup) {}
}
