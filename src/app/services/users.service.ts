import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment.test';
import { IUser } from '../interfaces/iuser.interface';
import { IToken } from '../interfaces/itoken.interface';
import { ILogin } from '../interfaces/ilogin.interface';
import { IMessage } from '../interfaces/imessage.interface';

type Response = {
  success: string;
  token: string;
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private endpoint = `${environment.host}/user`;
  private httpClient = inject(HttpClient);

  getByToken(token: string) {
    return lastValueFrom(
      this.httpClient.get<IUser>(this.endpoint, { headers: { Authorization: token } })
    );
  }

  create(user: IUser) {
    return lastValueFrom(this.httpClient.post<IToken>(`${this.endpoint}/signup`, user));
  }

  login(loginData: ILogin): Promise<Response> {
    return lastValueFrom(this.httpClient.post<Response>(`${this.endpoint}/login`, loginData));
  }

  changePassword(token: string, password: string) {
    return lastValueFrom(
      this.httpClient.patch<IToken>(
        `${this.endpoint}/login/change_password`,
        { password },
        { headers: { Authorization: token } }
      )
    );
  }

  remove(token: string) {
    return lastValueFrom(
      this.httpClient.delete<IMessage>(this.endpoint, { headers: { Authorization: token } })
    );
  }

  getUserSettings(): Promise<IUser> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(this.httpClient.get<IUser>(this.endpoint, { headers }));
  }
  
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: token ? `Bearer ${token}` : '' };
  }
  
  updateUserSettings(userData: Partial<IUser>): Promise<IUser> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(this.httpClient.patch<IUser>(this.endpoint, userData, { headers }));
  }

  saveNotificationPreference(enabled: boolean): Promise<IMessage> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(this.httpClient.patch<IMessage>(`${this.endpoint}/notifications`, { notifications_enabled: enabled }, { headers }));
  }
}
