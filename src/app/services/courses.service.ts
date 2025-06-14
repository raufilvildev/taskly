import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment.test';
import { ICourse } from '../interfaces/icourse.interface';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private endpoint = `${environment.host}/courses`;
  private httpClient = inject(HttpClient);

  getAll(token: string) {
    return lastValueFrom(
      this.httpClient.get<ICourse[]>(this.endpoint, {
        headers: { Authorization: token },
      })
    );
  }

  getByUuid(token: string, course_uuid: string) {
    return lastValueFrom(
      this.httpClient.get<ICourse>(`${this.endpoint}/${course_uuid}`, {
        headers: { Authorization: token },
      })
    );
  }

  create(token: string, course: ICourse) {
    return lastValueFrom(
      this.httpClient.post<ICourse>(this.endpoint, course, {
        headers: { Authorization: token },
      })
    );
  }
}
