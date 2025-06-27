import { Component, inject, Input, signal } from '@angular/core';
import { UsersService } from '../../../../../services/users.service';
import { IGetByTokenUser } from '../../../../../interfaces/iuser.interface';
import { ThreadComponent } from './components/thread/thread.component';
import { IThread } from '../../../../../interfaces/iforum.interface';
import { ForumService } from '../../../../../services/forum.service';
import { ThreadFormComponent } from './components/thread-form/thread-form.component';
import { Router } from '@angular/router';
import { initUser } from '../../../../../shared/utils/initializers';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../../services/theme.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-course-forum',
  imports: [ThreadComponent, ThreadFormComponent, MatIcon],
  templateUrl: './course-forum.component.html',
  styleUrl: './course-forum.component.css',
})
export class CourseForumComponent {
  usersService = inject(UsersService);
  forumService = inject(ForumService);
  themeService = inject(ThemeService);

  router = inject(Router);

  @Input() course_uuid: string = '';

  private themeSub?: Subscription;

  user: IGetByTokenUser = initUser();
  forum: IThread[] = [];
  showThreadForm = false;
  threadUuidWhereAResponseIsBeingEdited = '';
  threadUuidWhereAResponseIsBeingCreated = '';
  order = 'desc';
  isDarkMode = signal(false);

  async updateForum() {
    try {
      this.forum = await this.forumService.getAll(this.course_uuid, this.order);
    } catch (error) {
      return;
    }
  }

  toggleOrder() {
    if (this.order === 'desc') {
      this.order = 'asc';
    } else {
      this.order = 'desc';
    }
  }

  onThreadAnswered(event: string) {
    this.threadUuidWhereAResponseIsBeingCreated = event;
    this.threadUuidWhereAResponseIsBeingEdited = '';
  }

  onThreadEdited(event: string) {
    this.threadUuidWhereAResponseIsBeingEdited = event;
    this.threadUuidWhereAResponseIsBeingCreated = '';
  }

  async ngOnInit() {
    // Inicializa el valor del tema actual
    this.isDarkMode.set(this.themeService.currentValue);

    // Suscríbete al observable para actualizar el signal cuando el tema cambie
    this.themeSub = this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode.set(isDark);
    });

    try {
      this.user = await this.usersService.getByToken();
      await this.updateForum();
    } catch (error) {
      return;
    }
  }

  ngOnDestroy() {
    // Cancelar suscripción para evitar memory leaks
    this.themeSub?.unsubscribe();
  }
}
