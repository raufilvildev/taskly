import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.test';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IResponse, IThread } from '../interfaces/iforum.interface';
import { IMessage } from '../interfaces/imessage.interface';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private endpoint = `${environment.host}/forum`;
  private httpClient = inject(HttpClient);

  getAll(token: string) {
    return lastValueFrom(
      this.httpClient.get<IThread[]>(this.endpoint, {
        headers: { Authorization: token },
      })
    );
  }

  createThread(token: string, thread: IThread) {
    return lastValueFrom(
      this.httpClient.post<IMessage>(`${this.endpoint}/post/thread`, thread, {
        headers: { Authorization: token },
      })
    );
  }

  editThread(token: string, thread: IThread) {
    return lastValueFrom(
      this.httpClient.put<IMessage>(`${this.endpoint}/update/thread`, thread, {
        headers: { Authorization: token },
      })
    );
  }

  deleteThread(token: string, thread_uuid: string) {
    return lastValueFrom(
      this.httpClient.delete<IMessage>(`${this.endpoint}/delete/thread/${thread_uuid}`, {
        headers: { Authorization: token },
      })
    );
  }

  createResponse(token: string, response: IResponse) {
    return lastValueFrom(
      this.httpClient.post<IMessage>(`${this.endpoint}/post/response`, response, {
        headers: { Authorization: token },
      })
    );
  }

  editResponse(token: string, response: IResponse) {
    return lastValueFrom(
      this.httpClient.put<IMessage>(`${this.endpoint}/update/response`, response, {
        headers: { Authorization: token },
      })
    );
  }

  deleteResponse(token: string, response_uuid: string) {
    return lastValueFrom(
      this.httpClient.delete<IMessage>(`${this.endpoint}/delete/response/${response_uuid}`, {
        headers: { Authorization: token },
      })
    );
  }
}
