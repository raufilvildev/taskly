import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UsersService } from '../../../../../../../services/users.service';
import { IGetByTokenUser } from '../../../../../../../interfaces/iuser.interface';
import { IResponse } from '../../../../../../../interfaces/iforum.interface';
import { ResponseFormComponent } from '../response-form/response-form.component';
import { ForumService } from '../../../../../../../services/forum.service';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from '../../../../../../../shared/utils/constants/constants.config';
import { FormatDatePipe } from '../../../../../../../pipes/format-date.pipe';
import { FormatTextPipe } from '../../../../../../../pipes/format-text.pipe';
import { initResponse, initUser } from '../../../../../../../shared/utils/initializers';
import { CreateEditCancelRemoveButtonComponent } from '../../../../../../../shared/components/buttons/create-edit-cancel-remove-button/create-edit-cancel-remove-button.component';
import { environment } from '../../../../../../../environments/environment.test';

@Component({
  selector: 'app-response',
  imports: [
    ResponseFormComponent,
    FormatDatePipe,
    FormatTextPipe,
    CreateEditCancelRemoveButtonComponent,
  ],
  templateUrl: './response.component.html',
  styleUrl: './response.component.css',
})
export class ResponseComponent {
  usersService = inject(UsersService);
  forumService = inject(ForumService);

  @Input() response: IResponse = initResponse();
  @Input() user: IGetByTokenUser = initUser();
  @Input() editedResponseUuid = '';
  @Input() threadUuid = '';
  @Input() threadUuidWhereAResponseIsBeingEdited = '';

  @Output() editResponse = new EventEmitter<string>();
  @Output() delete = new EventEmitter<void>();

  showResponseForm = false;
  showDeleteConfirmation = false;
  deleteResponseError = '';
  profile_image_endpoint = `${environment.host}/uploads/users/`;

  updateThread(state: boolean, response_uuid: string | undefined) {
    this.showResponseForm = state;
    this.editResponse.emit(state ? response_uuid : '');
  }

  updateShowDeleteConfirmation(state: boolean) {
    this.showDeleteConfirmation = state;
  }

  async deleteResponse(response_uuid: string) {
    try {
      await this.forumService.deleteResponse(response_uuid);
      this.delete.emit();
      this.updateShowDeleteConfirmation(false);
      this.showDeleteConfirmation = false;
      this.showResponseForm = false;
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
        this.deleteResponseError = constants.generalServerError;
        return;
      }

      if (errorResponse instanceof HttpErrorResponse) {
        this.deleteResponseError = errorResponse.error;
        return;
      }

      this.deleteResponseError = constants.generalServerError;
    }
  }
}
