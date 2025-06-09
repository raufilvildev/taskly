import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../../../../../../interfaces/iuser.interface';
import { ForumService } from '../../../../../../../services/forum.service';

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

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  responseForm = new FormGroup({
    content: new FormControl('', Validators.required),
  });

  cancelResponseForm() {
    this.cancel.emit();
  }

  createResponse(responseForm: FormGroup) {
    const response = responseForm.value;
    response.user = this.user;
    this.forumService.createResponse(this.token, response);
    this.create.emit();
  }

  editResponse(responseForm: FormGroup) {
    const response = responseForm.value;
    response.user = this.user;
    this.forumService.editResponse(this.token, response);
    this.edit.emit();
  }

  onSubmit(type: string) {
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
