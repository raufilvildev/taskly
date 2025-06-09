import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IThread } from '../../../../../../../interfaces/iforum.interface';
import { ForumService } from '../../../../../../../services/forum.service';
import { AuthorizationService } from '../../../../../../../services/authorization.service';
import { IUser } from '../../../../../../../interfaces/iuser.interface';

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

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  token = '';

  threadForm = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
  });

  createThread(threadForm: FormGroup) {}

  editThread(threadForm: FormGroup) {
    const thread = threadForm.value;
    thread.uuid = this.thread.uuid;
    thread.user = this.thread.user;

    this.forumService.editThread(this.token, thread);
    this.save.emit(); // Al pulsar en guardar, cerraremos el formulario
  }

  cancelThreadForm() {
    this.cancel.emit(); // Al pulsar en cancelar, cerraremos el formulario
  }

  ngOnInit() {
    this.token = this.authorizationService.getToken() as string;
    this.threadForm = new FormGroup({
      title: new FormControl(this.thread.title, Validators.required),
      content: new FormControl(this.thread.content, Validators.required),
    });
  }
}
