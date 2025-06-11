import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from '../../../shared/utils/constants/constants.config';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  
  usersService = inject(UsersService)
  router = inject(Router)
  authorizationService = inject(AuthorizationService)

  loginError = ""
  
  async getLogin(form:any) {
    let token = '';

    try {
      if (form.value.username !== "" && form.value.password !== "") {
        const { token } = await this.usersService.login(form.value);
        this.authorizationService.setToken(token)
        this.router.navigate(['/dashboard'])
      } else {
        this.loginError = "Usuario o contraseña incorrectos";
      }
    } catch (errorResponse) {
        this.usersService.remove(token);
        localStorage.removeItem('token');
        if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
          this.loginError = constants.generalServerError;
          return;
        }
        if (errorResponse instanceof HttpErrorResponse) {
          this.loginError = errorResponse.error;
          return;
        }

        this.loginError = constants.generalServerError;
    }
  }
}
