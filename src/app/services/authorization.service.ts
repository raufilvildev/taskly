import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.test';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IToken } from '../interfaces/itoken.interface';
import { IMessage } from '../interfaces/imessage.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private endpoint = `${environment.host}/api/authorization`;
  private httpClient = inject(HttpClient);

  getToken(): string {
    let token = localStorage.getItem('token');
    if (!token) return '';
    return token;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  requestConfirmationByEmail(type: string) {
    return lastValueFrom(
      this.httpClient.post<IMessage>(`${this.endpoint}/email_confirmation/request/${type}`, {})
    );
  }

  checkRandomNumberInput(random_number_input: string) {
    return lastValueFrom(
      this.httpClient.post<IToken>(`${this.endpoint}/email_confirmation`, { random_number_input })
    );
  }

  checkEmail(email: string) {
    return lastValueFrom(this.httpClient.post<IToken>(`${this.endpoint}/check_email`, { email }));
  }

  resetRandomNumber() {
    return lastValueFrom(
      this.httpClient.patch<IMessage>(`${this.endpoint}/reset/random_number`, {})
    );
  }
}
