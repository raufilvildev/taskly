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

  @Output() update = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  showThreadForm = false;
  showResponses = false;
  showResponseForm = false;
  uuid = '02';
  type: 'create' | 'edit' = 'create';

  updateForum() {
    this.showThreadForm = false;
    this.update.emit(); // Actualizo el foro
  }

  async deleteThread(thread_uuid: string) {
    await this.forumService.deleteThread(this.token, thread_uuid);
    this.delete.emit();
  }
}
