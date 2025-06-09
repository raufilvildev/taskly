import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthorizationService } from '../../../../../../../services/authorization.service';
import { UsersService } from '../../../../../../../services/users.service';
import { IUser } from '../../../../../../../interfaces/iuser.interface';
import { IResponse } from '../../../../../../../interfaces/iforum.interface';
import { ResponseFormComponent } from '../response-form/response-form.component';
import { ForumService } from '../../../../../../../services/forum.service';

@Component({
  selector: 'app-response',
  imports: [ResponseFormComponent],
  templateUrl: './response.component.html',
  styleUrl: './response.component.css',
})
export class ResponseComponent {
  authorizationService = inject(AuthorizationService);
  usersService = inject(UsersService);
  forumService = inject(ForumService);

  @Input() response!: IResponse;
  @Input() user!: IUser;
  @Input() token = '';
  @Input() editedResponseUuid = '';
  @Input() threadUuid = '';
  @Input() threadUuidWhereAResponseIsBeingEdited = '';

  @Output() editResponse = new EventEmitter<string>();
  @Output() delete = new EventEmitter<void>();

  showResponseForm = false;

  updateThread(state: boolean, response_uuid: string | undefined) {
    this.showResponseForm = state;
    this.editResponse.emit(response_uuid);
  }

  async deleteResponse(response_uuid: string | undefined) {
    await this.forumService.deleteResponse(this.token, response_uuid as string);
    this.delete.emit();
  }
}
