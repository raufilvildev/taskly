import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AuthorizationService } from '../../../../../../../services/authorization.service';
import { UsersService } from '../../../../../../../services/users.service';
import { IUser } from '../../../../../../../interfaces/iuser.interface';

@Component({
  selector: 'app-comment',
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent {
  authorizationService = inject(AuthorizationService);
  usersService = inject(UsersService);

  private shouldFocus = false;

  @ViewChild('editableParagraph') editableParagraph?: ElementRef<HTMLParagraphElement>;

  @Input() comment?: {
    uuid: string;
    user: { uuid: string; first_name: string; last_name: string; img_url: string; role: string };
    created_at: string;
    updated_at: string;
    content: string;
  };
  @Input() shouldShowResponses = false;
  @Input() user?: IUser;
  @Input() isEditing = false;
  @Input() isReplying = false;
  @Output() toggleEdit = new EventEmitter<void>();
  @Output() submitReply = new EventEmitter<string>();
  @Output() cancelReply = new EventEmitter<void>();

  originalContent: string = '';

  checkCommentOwner(uuid: string | undefined) {
    if (uuid !== this.user?.uuid) return false;
    return true;
  }

  activateEdit(el: ElementRef | HTMLElement) {
    setTimeout(() => {
      let element: HTMLElement;
      if (el instanceof ElementRef) {
        element = el.nativeElement;
      } else {
        element = el;
      }

      element.focus();

      if (
        typeof window.getSelection !== 'undefined' &&
        typeof document.createRange !== 'undefined'
      ) {
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);

        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 0);
  }

  editComment(uuid: string | undefined) {}

  removeComment(uuid: string | undefined) {}

  restoreOriginalContentIfNeeded() {
    if (!this.editableParagraph) return;

    const el = this.editableParagraph.nativeElement as HTMLElement;
    const currentContent = el.innerText.trim();

    if (currentContent !== this.originalContent.trim()) {
      el.innerText = this.originalContent;
    }
  }

  onSubmitReply() {
    const text = this.editableParagraph?.nativeElement.innerText.trim();
    if (text) {
      this.submitReply.emit(text);
      this.cancelReply.emit();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isEditing']?.currentValue || changes['isReplying']?.currentValue) {
      this.originalContent = this.comment?.content || '';
      this.shouldFocus = true; // marcar que hay que hacer foco
    }

    if ((!this.isEditing && changes['isEditing']) || (!this.isReplying && changes['isReplying'])) {
      this.restoreOriginalContentIfNeeded();
    }
  }

  ngAfterViewChecked() {
    if (this.shouldFocus && this.editableParagraph) {
      this.activateEdit(this.editableParagraph);
      this.shouldFocus = false; // reset para no repetir foco
    }
  }
}
