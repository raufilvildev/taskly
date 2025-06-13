import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IThread } from '../../../../../../../interfaces/iforum.interface';
import { ForumService } from '../../../../../../../services/forum.service';
import { AuthorizationService } from '../../../../../../../services/authorization.service';
import { IUser } from '../../../../../../../interfaces/iuser.interface';
import { constants } from '../../../../../../../shared/utils/constants/constants.config';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-thread-form',
  imports: [ReactiveFormsModule],
  templateUrl: './thread-form.component.html',
  styleUrl: './thread-form.component.css',
})
export class ThreadFormComponent {
  authorizationService = inject(AuthorizationService);
  forumService = inject(ForumService);

  @Input() thread!: IThread;
  @Input() type: 'create' | 'edit' = 'create';
  @Input() user!: IUser;
  @Input() course_uuid = '';

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();

  token = '';
  threadFormError = '';

  threadForm = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
  });

  async createThread(threadForm: FormGroup) {
    const thread = threadForm.value;

    if (!thread.title) {
      this.threadFormError = 'El título no puede ser vacío.';
      return;
    }

    if (!thread.content) {
      this.threadFormError = 'El contenido no puede ser vacío.';
      return;
    }

    thread.uuid = this.thread.uuid;
    thread.user = this.thread.user;

    try {
      await this.forumService.createThread(this.token, this.course_uuid, thread);
      this.create.emit();
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
        this.threadFormError = constants.generalServerError;
        return;
      }

      if (errorResponse instanceof HttpErrorResponse) {
        this.threadFormError = errorResponse.error;
        return;
      }

      this.threadFormError = constants.generalServerError;
    }
  }

  async editThread(threadForm: FormGroup) {
    const thread = threadForm.value;

    if (!thread.title) {
      this.threadFormError = 'El título no puede ser vacío.';
      return;
    }

    if (!thread.content) {
      this.threadFormError = 'El contenido no puede ser vacío.';
      return;
    }

    thread.uuid = this.thread.uuid;
    thread.user = this.thread.user;

    try {
      await this.forumService.editThread(this.token, thread);
      this.save.emit();
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
        this.threadFormError = constants.generalServerError;
        return;
      }

      if (errorResponse instanceof HttpErrorResponse) {
        this.threadFormError = errorResponse.error;
        return;
      }

      this.threadFormError = constants.generalServerError;
    }
  }

  cancelThreadForm() {
    this.cancel.emit();
  }

  ngOnInit() {
    this.token = this.authorizationService.getToken() as string;
    this.threadForm = new FormGroup({
      title: new FormControl(this.thread.title, Validators.required),
      content: new FormControl(this.thread.content.replaceAll('\\n', '\n'), Validators.required),
    });
  }
}
