import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  
  userService = inject(UsersService)
  router = inject(Router)

  
  async getLogin(form:any) {
    console.log(form.value)
    try {
      let response = await this.userService.login(form.value);
      if (response.success) {
        localStorage.setItem('token', response.token)
        this.router.navigate(['/dashboard'])
      }
      localStorage.setItem('token',response.token)
    } catch (msg:any) {
      alert('Usuario o contraseña incorrectos')
    }
  }
}
