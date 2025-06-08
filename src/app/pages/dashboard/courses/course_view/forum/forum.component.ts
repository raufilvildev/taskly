import { Component, inject } from '@angular/core';
import { CommentComponent } from './components/comment/comment.component';
import { AuthorizationService } from '../../../../../services/authorization.service';
import { UsersService } from '../../../../../services/users.service';
import { IUser } from '../../../../../interfaces/iuser.interface';

@Component({
  selector: 'app-forum',
  imports: [CommentComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css',
})
export class ForumComponent {
  authorizationService = inject(AuthorizationService);
  usersService = inject(UsersService);

  user: IUser = {
    uuid: '02',
    first_name: 'Raúl',
    last_name: 'Filigrana Villalba',
    birth_date: '01/08/2000',
    email: 'raufilvil@gmail.com',
    img_url: '',
    username: 'raufilvil',
    role: 'student',
  };

  comments: {
    uuid: string;
    user: { uuid: string; first_name: string; last_name: string; img_url: string; role: string };
    created_at: string;
    updated_at: string;
    content: string;
    responses: {
      uuid: string;
      user: { uuid: string; first_name: string; last_name: string; img_url: string; role: string };
      created_at: string;
      updated_at: string;
      content: string;
    }[];
  }[] = [];

  showResponses?: { uuid: string; show: boolean }[];
  showResponseForm = false;

  editingCommentUuid: string | null = null;

  respondingToCommentUuid: string | null = null;

  activateEdit(uuid: string) {
    // Cancelar respuesta si se está respondiendo
    this.respondingToCommentUuid = null;

    // Alternar edición
    if (this.editingCommentUuid === uuid) {
      this.editingCommentUuid = null;
    } else {
      this.editingCommentUuid = uuid;
    }
  }
  isEditingChildComment(parentUuid: string): boolean {
    const parent = this.comments.find((child) => child.uuid === parentUuid);
    if (!parent) return false;
    return (
      parent.responses.some((response) => response.uuid === this.editingCommentUuid) ||
      parent.uuid === this.editingCommentUuid
    );
  }

  changeShowStatus(uuid: string) {
    if (!this.showResponses) return;
    const answer = this.showResponses.find((item) => item.uuid === uuid);

    if (answer) {
      answer.show = !answer.show;
      if (!answer.show && this.editingCommentUuid && this.isEditingChildComment(uuid)) {
        this.editingCommentUuid = null;
      }
    }
  }

  shouldShowResponses(uuid: string | undefined) {
    if (!uuid) return false;
    if (!this.showResponses) return false;
    const show: boolean | undefined = this.showResponses.find((item) => item.uuid === uuid)?.show;
    return !show ? false : true;
  }

  startReply(uuid: string) {
    // Cancelar edición si se está editando
    this.editingCommentUuid = null;

    // Iniciar respuesta
    this.respondingToCommentUuid = uuid;
  }

  cancelReply() {
    this.respondingToCommentUuid = null;
  }

  submitReply(content: string) {
    console.log('Respuesta enviada:', content);
    // Aquí añades la lógica de guardado real
    this.respondingToCommentUuid = null;
  }

  async ngOnInit() {
    try {
      const token = this.authorizationService.getToken();

      if (!token) return;
      //this.user = await this.usersService.getById(token);
    } catch (error) {
      return;
    }

    this.comments = [
      {
        uuid: '0',
        user: {
          uuid: '02',
          first_name: 'Nombre del usuario',
          last_name: '',
          img_url: '',
          role: 'teacher',
        },
        created_at: '07/06/2025 10:54',
        updated_at: '07/06/2025 10:54',
        content: 'Contenido del comentario',
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
              uuid: '02',
              first_name: 'Nombre del usuario',
              last_name: '2',
              img_url: '',
              role: 'teacher',
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
              uuid: '05',
              first_name: 'Nombre del usuario',
              last_name: '5',
              img_url: '',
              role: 'teacher',
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
          uuid: '02',
          first_name: 'Nombre del usuario',
          last_name: '6',
          img_url: '',
          role: 'teacher',
        },
        created_at: '07/06/2025 10:54',
        updated_at: '07/06/2025 10:54',
        content: 'Contenido del comentario 6',
        responses: [
          {
            uuid: '7',
            user: {
              uuid: '02',
              first_name: 'Nombre del usuario',
              last_name: '7',
              img_url: '',
              role: 'teacher',
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
    this.showResponses = this.comments.map((comment) => {
      return { uuid: comment.uuid, show: false };
    });
  }
}
