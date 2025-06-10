import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ResponseComponent } from '../response/response.component';
import { ThreadFormComponent } from '../thread-form/thread-form.component';
import { IThread } from '../../../../../../../interfaces/iforum.interface';
import { ForumService } from '../../../../../../../services/forum.service';
import { ResponseFormComponent } from '../response-form/response-form.component';
import { IUser } from '../../../../../../../interfaces/iuser.interface';

@Component({
  selector: 'app-thread',
  imports: [ResponseComponent, ThreadFormComponent, ResponseFormComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.css',
})
export class ThreadComponent {
  forumService = inject(ForumService);

  @Input() thread!: IThread;
  @Input() token = '';
  @Input() user!: IUser;
  @Input() threadUuidWhereAResponseIsBeingEdited = '';
  @Input() threadUuidWhereAResponseIsBeingCreated = '';
  @Output() update = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() editedThread = new EventEmitter<string>();
  @Output() answeredThread = new EventEmitter<string>();

  showThreadForm = false;
  showResponses = false;
  showResponseForm = false;
  editedResponseUuid = '';

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
    this.update.emit();
  }

  updateShowResponseForm(state: boolean) {
    this.showResponseForm = state;
  }

  async deleteThread(thread_uuid: string) {
    await this.forumService.deleteThread(this.token, thread_uuid);
    this.delete.emit();
  }
}
