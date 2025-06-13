import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthorizationService } from '../../../../../services/authorization.service';
import { UsersService } from '../../../../../services/users.service';
import { IUser } from '../../../../../interfaces/iuser.interface';
import { ThreadComponent } from './components/thread/thread.component';
import { IThread } from '../../../../../interfaces/iforum.interface';
import { ForumService } from '../../../../../services/forum.service';
import { ThreadFormComponent } from './components/thread-form/thread-form.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-forum',
  imports: [ThreadComponent, ThreadFormComponent],
  templateUrl: './course-forum.component.html',
  styleUrl: './course-forum.component.css',
})
export class CourseForumComponent {
  authorizationService = inject(AuthorizationService);
  usersService = inject(UsersService);
  forumService = inject(ForumService);
  router = inject(Router);

  @Input() course_uuid: string = '';
  token = '';
  user!: IUser;
  forum: IThread[] = [];
  showThreadForm = false;
  threadUuidWhereAResponseIsBeingEdited = '';
  threadUuidWhereAResponseIsBeingCreated = '';

  async updateForum() {
    this.forum = await this.forumService.getAll(this.token, this.course_uuid);
  }

  onThreadAnswered(event: string) {
    this.threadUuidWhereAResponseIsBeingCreated = event;
    this.threadUuidWhereAResponseIsBeingEdited = '';
  }

  onThreadEdited(event: string) {
    this.threadUuidWhereAResponseIsBeingEdited = event;
    this.threadUuidWhereAResponseIsBeingCreated = '';
  }

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    this.token = this.authorizationService.getToken() as string;

    try {
      this.user = await this.usersService.getByToken(this.token);
      await this.updateForum();
    } catch (error) {
      return;
    }
  }
}
