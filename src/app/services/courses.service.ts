import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment.test';
import { ICourse } from '../interfaces/icourse.interface';
import { IMessage } from '../interfaces/imessage.interface';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private endpoint = `${environment.host}/api/courses`;
  private httpClient = inject(HttpClient);

  getAll() {
    return lastValueFrom(this.httpClient.get<ICourse[]>(this.endpoint));
  }

  getByUuid(course_uuid: string) {
    return lastValueFrom(this.httpClient.get<ICourse>(`${this.endpoint}/${course_uuid}`));
  }

  exportPdfViewCourse(course_uuid: string) {
    return lastValueFrom(
      this.httpClient.get(`${this.endpoint}/${course_uuid}/export-pdf`, {
        responseType: 'blob',
      })
    );
  }

  create(course: FormData) {
    return lastValueFrom(this.httpClient.post<ICourse>(this.endpoint, course));
  }

  edit(course: FormData) {
    return lastValueFrom(this.httpClient.put<ICourse>(this.endpoint, course));
  }

  delete(course_uuid: string) {
    return lastValueFrom(this.httpClient.delete<IMessage>(`${this.endpoint}/${course_uuid}`));
  }
}
