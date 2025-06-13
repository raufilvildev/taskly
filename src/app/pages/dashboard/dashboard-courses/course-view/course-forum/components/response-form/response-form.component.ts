import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../../../../../../interfaces/iuser.interface';
import { ForumService } from '../../../../../../../services/forum.service';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from '../../../../../../../shared/utils/constants/constants.config';

@Component({
  selector: 'app-response-form',
  imports: [ReactiveFormsModule],
  templateUrl: './response-form.component.html',
  styleUrl: './response-form.component.css',
})
export class ResponseFormComponent {
  forumService = inject(ForumService);

  @Input() user!: IUser;
  @Input() token: string = '';
  @Input() type: 'create' | 'edit' = 'create';
  @Input() content = '';
  @Input() threadUuid = '';

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  responseFormError = '';

  responseForm = new FormGroup({
    content: new FormControl('', Validators.required),
  });

  cancelResponseForm() {
    this.cancel.emit();
  }

  async createResponse(responseForm: FormGroup) {
    const response = responseForm.value;
    response.user = this.user;

    if (!response.content) {
      this.responseFormError = 'El contenido no puede ser vacío.';
      return;
    }

    try {
      await this.forumService.createResponse(this.token, this.threadUuid, response);
      this.create.emit();
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
        this.responseFormError = constants.generalServerError;
        return;
      }

      if (errorResponse instanceof HttpErrorResponse) {
        this.responseFormError = errorResponse.error;
        return;
      }

      this.responseFormError = constants.generalServerError;
    }
  }

  async editResponse(responseForm: FormGroup) {
    const response = responseForm.value;
    response.user = this.user;

    if (!response.content) {
      this.responseFormError = 'El contenido no puede ser vacío.';
      return;
    }

    try {
      await this.forumService.editResponse(this.token, response);
      this.edit.emit();
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
        this.responseFormError = constants.generalServerError;
        return;
      }

      if (errorResponse instanceof HttpErrorResponse) {
        this.responseFormError = errorResponse.error;
        return;
      }

      this.responseFormError = constants.generalServerError;
    }
  }

  onSubmit() {
    if (this.type === 'create') {
      this.createResponse(this.responseForm);
    } else {
      this.editResponse(this.responseForm);
    }
  }

  ngOnInit() {
    this.responseForm = new FormGroup({
      content: new FormControl(this.content, Validators.required),
    });
  }
}
