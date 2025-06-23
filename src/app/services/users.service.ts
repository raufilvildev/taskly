import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, lastValueFrom, tap } from 'rxjs';
import { environment } from '../environments/environment.test';
import { IGetByTokenUser, ISignupUser, IUser } from '../interfaces/iuser.interface';
import { IToken } from '../interfaces/itoken.interface';
import { ILogin } from '../interfaces/ilogin.interface';
import { IMessage } from '../interfaces/imessage.interface';
import { initUser } from '../shared/utils/initializers';

type Response = {
  success: string;
  token: string;
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private endpoint = `${environment.host}/api/user`;
  private httpClient = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<IGetByTokenUser>(initUser());
  currentUser$ = this.currentUserSubject.asObservable();

  getByToken() {
    return lastValueFrom(
      this.httpClient
        .get<IGetByTokenUser>(this.endpoint)
        .pipe(tap((user) => this.currentUserSubject.next(user)))
    );
  }

  getByEmail(email: string) {
    return lastValueFrom(this.httpClient.get<IGetByTokenUser>(`${this.endpoint}/email/${email}`));
  }

  get currentUser(): IGetByTokenUser {
    return this.currentUserSubject.value;
  }

  create(user: ISignupUser) {
    return lastValueFrom(this.httpClient.post<IToken>(`${this.endpoint}/signup`, user));
  }

  login(loginData: ILogin): Promise<Response> {
    return lastValueFrom(this.httpClient.post<Response>(`${this.endpoint}/login`, loginData));
  }

  changePassword(password: string) {
    return lastValueFrom(
      this.httpClient.patch<IToken>(`${this.endpoint}/login/change_password`, { password })
    );
  }

  remove() {
    return lastValueFrom(this.httpClient.delete<IMessage>(this.endpoint));
  }

  update(user: FormData) {
    return lastValueFrom(
      this.httpClient.put<IToken>(`${this.endpoint}/update`, user).pipe(
        tap(() => {
          this.getByToken();
        })
      )
    );
  }
}
