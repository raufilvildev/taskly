import { Component, inject } from '@angular/core';
import { AuthorizationService } from '../../../../../services/authorization.service';
import { UsersService } from '../../../../../services/users.service';
import { IUser } from '../../../../../interfaces/iuser.interface';
import { ThreadComponent } from './components/thread/thread.component';
import { IThread } from '../../../../../interfaces/iforum.interface';
import { ForumService } from '../../../../../services/forum.service';
import { ThreadFormComponent } from './components/thread-form/thread-form.component';

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

  token = '';
  user!: IUser;
  forum: IThread[] = [];
  showThreadForm = false;
  threadUuidWhereAResponseIsBeingEdited = '';

  async updateForum() {
    this.forum = await this.forumService.getAll(this.token);
  }

  showResponses?: { uuid: string; show: boolean }[];
  showResponseForm = false;

  async ngOnInit() {
    this.token = this.authorizationService.getToken() as string;

    try {
      this.user = await this.usersService.getByToken(this.token);
    } catch (error) {
      return;
    }

    try {
      await this.updateForum();
    } catch (error) {
      this.forum = [
        {
          uuid: '0',
          user: {
            uuid: this.user.uuid as string,
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            img_url: this.user.img_url as string,
            role: this.user.role as 'student' | 'teacher',
          },
          title: 'Título del thread 1',
          created_at: '07/06/2025 10:54',
          updated_at: '07/06/2025 10:54',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro tenetur consequuntur ad aspernatur, suscipit id excepturi, ducimus eum reiciendis labore explicabo officiis ab at molestiae facilis perspiciatis beatae corrupti dicta!',
          responses: [
            {
              uuid: '1',
              user: {
                uuid: '01',
                first_name: 'Nombre del usuario',
                last_name: '1',
                img_url: '',
                role: 'student',
              },
              created_at: '07/06/2025 10:55',
              updated_at: '07/06/2025 10:55',
              content: 'Contenido de la respuesta 1',
            },
            {
              uuid: '2',
              user: {
                uuid: this.user.uuid as string,
                first_name: this.user.first_name,
                last_name: this.user.last_name,
                img_url: this.user.img_url as string,
                role: this.user.role as 'student' | 'teacher',
              },
              created_at: '07/06/2025 10:55',
              updated_at: '07/06/2025 10:55',
              content: 'Contenido de la respuesta 2',
            },
            {
              uuid: '3',
              user: {
                uuid: '03',
                first_name: 'Nombre del usuario',
                last_name: '3',
                img_url: '',
                role: 'student',
              },
              created_at: '07/06/2025 10:55',
              updated_at: '07/06/2025 10:55',
              content: 'Contenido de la respuesta 3',
            },
            {
              uuid: '4',
              user: {
                uuid: '04',
                first_name: 'Nombre del usuario',
                last_name: '4',
                img_url: '',
                role: 'student',
              },
              created_at: '07/06/2025 10:55',
              updated_at: '07/06/2025 10:55',
              content: 'Contenido de la respuesta 4',
            },
            {
              uuid: '5',
              user: {
                uuid: this.user.uuid as string,
                first_name: this.user.first_name,
                last_name: this.user.last_name,
                img_url: this.user.img_url as string,
                role: this.user.role as 'student' | 'teacher',
              },
              created_at: '07/06/2025 10:55',
              updated_at: '07/06/2025 10:55',
              content: 'Contenido de la respuesta 5',
            },
          ],
        },
        {
          uuid: '6',
          user: {
            uuid: '01',
            first_name: 'Nombre del usuario',
            last_name: '6',
            img_url: '',
            role: 'teacher',
          },
          title: 'Título del thread 2',
          created_at: '07/06/2025 10:54',
          updated_at: '07/06/2025 10:54',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro tenetur consequuntur ad aspernatur, suscipit id excepturi, ducimus eum reiciendis labore explicabo officiis ab at molestiae facilis perspiciatis beatae corrupti dicta!',
          responses: [
            {
              uuid: '7',
              user: {
                uuid: this.user.uuid as string,
                first_name: this.user.first_name,
                last_name: this.user.last_name,
                img_url: this.user.img_url as string,
                role: this.user.role as 'student' | 'teacher',
              },
              created_at: '07/06/2025 10:55',
              updated_at: '07/06/2025 10:55',
              content: 'Contenido de la respuesta 7',
            },
            {
              uuid: '8',
              user: {
                uuid: '68',
                first_name: 'Nombre del usuario',
                last_name: '8',
                img_url: '',
                role: 'student',
              },
              created_at: '07/06/2025 10:55',
              updated_at: '07/06/2025 10:55',
              content: 'Contenido de la respuesta 8',
            },
            {
              uuid: '9',
              user: {
                uuid: '69',
                first_name: 'Nombre del usuario',
                last_name: '9',
                img_url: '',
                role: 'student',
              },
              created_at: '07/06/2025 10:55',
              updated_at: '07/06/2025 10:55',
              content: 'Contenido de la respuesta 9',
            },
            {
              uuid: '10',
              user: {
                uuid: '610',
                first_name: 'Nombre del usuario',
                last_name: '10',
                img_url: '',
                role: 'student',
              },
              created_at: '07/06/2025 10:55',
              updated_at: '07/06/2025 10:55',
              content: 'Contenido de la respuesta 10',
            },
            {
              uuid: '12',
              user: {
                uuid: '612',
                first_name: 'Nombre del usuario',
                last_name: '11',
                img_url: '',
                role: 'student',
              },
              created_at: '07/06/2025 10:55',
              updated_at: '07/06/2025 10:55',
              content: 'Contenido de la respuesta 11',
            },
          ],
        },
      ];
    }

    this.showResponses = this.forum.map((thread) => {
      return { uuid: thread.uuid, show: false };
    });
  }
}
