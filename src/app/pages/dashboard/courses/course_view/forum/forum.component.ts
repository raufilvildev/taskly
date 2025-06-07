import { Component } from '@angular/core';
import { CommentComponent } from './components/comment/comment.component';

@Component({
  selector: 'app-forum',
  imports: [CommentComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css',
})
export class ForumComponent {
  comments: {
    uuid: string;
    user: { name: string; img_url: string };
    created_at: string;
    updated_at: string;
    content: string;
    responses: {
      uuid: string;
      user: { name: string; img_url: string };
      created_at: string;
      updated_at: string;
      content: string;
    }[];
  }[] = [];

  showResponses?: { uuid: string; show: boolean }[];
  showResponseForm = false;

  changeShowStatus(uuid: string) {
    if (!this.showResponses) return;
    const answer = this.showResponses.find((item) => item.uuid === uuid);
    if (answer) {
      answer.show = !answer.show;
    }
  }

  shouldShowResponses(uuid: string) {
    if (!this.showResponses) return false;
    console.log(this.showResponses.find((item) => item.uuid === uuid));
    return this.showResponses.find((item) => item.uuid === uuid)?.show;
  }

  ngOnInit() {
    this.comments = [
      {
        uuid: '0',
        user: { name: 'Nombre del usuario', img_url: '' },
        created_at: '07/06/2025 10:54',
        updated_at: '07/06/2025 10:54',
        content: 'Contenido del comentario',
        responses: [
          {
            uuid: '1',
            user: { name: 'Nombre del usuario 1', img_url: '' },
            created_at: '07/06/2025 10:55',
            updated_at: '07/06/2025 10:55',
            content: 'Contenido de la respuesta 1',
          },
          {
            uuid: '2',
            user: { name: 'Nombre del usuario 2', img_url: '' },
            created_at: '07/06/2025 10:55',
            updated_at: '07/06/2025 10:55',
            content: 'Contenido de la respuesta 2',
          },
          {
            uuid: '3',
            user: { name: 'Nombre del usuario 3', img_url: '' },
            created_at: '07/06/2025 10:55',
            updated_at: '07/06/2025 10:55',
            content: 'Contenido de la respuesta 3',
          },
          {
            uuid: '4',
            user: { name: 'Nombre del usuario 4', img_url: '' },
            created_at: '07/06/2025 10:55',
            updated_at: '07/06/2025 10:55',
            content: 'Contenido de la respuesta 4',
          },
          {
            uuid: '5',
            user: { name: 'Nombre del usuario 5', img_url: '' },
            created_at: '07/06/2025 10:55',
            updated_at: '07/06/2025 10:55',
            content: 'Contenido de la respuesta 5',
          },
        ],
      },
      {
        uuid: '6',
        user: { name: 'Nombre del usuario 6', img_url: '' },
        created_at: '07/06/2025 10:54',
        updated_at: '07/06/2025 10:54',
        content: 'Contenido del comentario 6',
        responses: [
          {
            uuid: '7',
            user: { name: 'Nombre del usuario 7', img_url: '' },
            created_at: '07/06/2025 10:55',
            updated_at: '07/06/2025 10:55',
            content: 'Contenido de la respuesta 7',
          },
          {
            uuid: '8',
            user: { name: 'Nombre del usuario 8', img_url: '' },
            created_at: '07/06/2025 10:55',
            updated_at: '07/06/2025 10:55',
            content: 'Contenido de la respuesta 8',
          },
          {
            uuid: '9',
            user: { name: 'Nombre del usuario 9', img_url: '' },
            created_at: '07/06/2025 10:55',
            updated_at: '07/06/2025 10:55',
            content: 'Contenido de la respuesta 9',
          },
          {
            uuid: '10',
            user: { name: 'Nombre del usuario 10', img_url: '' },
            created_at: '07/06/2025 10:55',
            updated_at: '07/06/2025 10:55',
            content: 'Contenido de la respuesta 10',
          },
          {
            uuid: '12',
            user: { name: 'Nombre del usuario 11', img_url: '' },
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
