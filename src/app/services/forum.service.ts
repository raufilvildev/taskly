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
  private endpoint = `${environment.host}/api/forum`;
  private httpClient = inject(HttpClient);

  getAll(course_uuid: string, order: string = 'desc') {
    return lastValueFrom(
      this.httpClient.get<IThread[]>(`${this.endpoint}/${course_uuid}?order=${order}`)
    );
  }

  createThread(course_uuid: string, thread: IThread) {
    return lastValueFrom(
      this.httpClient.post<IMessage>(`${this.endpoint}/post/thread/${course_uuid}`, thread)
    );
  }

  editThread(thread: IThread) {
    return lastValueFrom(this.httpClient.put<IMessage>(`${this.endpoint}/update/thread/`, thread));
  }

  deleteThread(thread_uuid: string) {
    return lastValueFrom(
      this.httpClient.delete<IMessage>(`${this.endpoint}/delete/thread/${thread_uuid}`)
    );
  }

  createResponse(thread_uuid: string, response: IResponse) {
    return lastValueFrom(
      this.httpClient.post<IMessage>(`${this.endpoint}/post/response/${thread_uuid}`, response)
    );
  }

  editResponse(response: IResponse) {
    return lastValueFrom(
      this.httpClient.put<IMessage>(`${this.endpoint}/update/response`, response)
    );
  }

  deleteResponse(response_uuid: string) {
    return lastValueFrom(
      this.httpClient.delete<IMessage>(`${this.endpoint}/delete/response/${response_uuid}`)
    );
  }
}
