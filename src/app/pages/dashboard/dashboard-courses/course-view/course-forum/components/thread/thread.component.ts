import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ResponseComponent } from '../response/response.component';
import { ThreadFormComponent } from '../thread-form/thread-form.component';
import { IThread } from '../../../../../../../interfaces/iforum.interface';
import { ForumService } from '../../../../../../../services/forum.service';
import { ResponseFormComponent } from '../response-form/response-form.component';
import { IGetByTokenUser } from '../../../../../../../interfaces/iuser.interface';
import { constants } from '../../../../../../../shared/utils/constants/constants.config';
import { HttpErrorResponse } from '@angular/common/http';
import { FormatDatePipe } from '../../../../../../../pipes/format-date.pipe';
import { FormatTextPipe } from '../../../../../../../pipes/format-text.pipe';
import { initUser } from '../../../../../../../shared/utils/initializers';
import { environment } from '../../../../../../../environments/environment.test';

@Component({
  selector: 'app-thread',
  imports: [
    ResponseComponent,
    ThreadFormComponent,
    ResponseFormComponent,
    FormatDatePipe,
    FormatTextPipe,
  ],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.css',
})
export class ThreadComponent {
  forumService = inject(ForumService);

  @Input() thread!: IThread;
  @Input() user: IGetByTokenUser = initUser();
  @Input() course_uuid = '';
  @Input() threadUuidWhereAResponseIsBeingEdited = '';
  @Input() threadUuidWhereAResponseIsBeingCreated = '';

  @Output() update = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() editedThread = new EventEmitter<string>();
  @Output() answeredThread = new EventEmitter<string>();

  showThreadForm = false;
  showResponses = false;
  showResponseForm = false;
  showDeleteConfirmation = false;
  editedResponseUuid = '';
  deleteThreadError = '';
  profile_image_endpoint = `${environment.host}/uploads/users/`;

  type: 'create' | 'edit' = 'create';

  setEditedResponse(event: string) {
    this.editedResponseUuid = event;
    this.editedThread.emit(this.thread.uuid);
  }

  setAnsweredThread() {
    this.updateShowResponseForm(true);
    this.answeredThread.emit(this.thread.uuid);
  }

  updateForum() {
    this.showThreadForm = false;
    this.showResponseForm = false;
    this.update.emit();
  }

  updateShowResponseForm(state: boolean) {
    this.showResponseForm = state;
  }

  updateShowDeleteConfirmation(state: boolean) {
    this.showDeleteConfirmation = state;
  }

  async deleteThread(thread_uuid: string) {
    try {
      await this.forumService.deleteThread(thread_uuid);
      this.delete.emit();
      this.updateShowDeleteConfirmation(false);
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
        this.deleteThreadError = constants.generalServerError;
        return;
      }

      if (errorResponse instanceof HttpErrorResponse) {
        this.deleteThreadError = errorResponse.error;
        return;
      }

      this.deleteThreadError = constants.generalServerError;
    }
  }
}
