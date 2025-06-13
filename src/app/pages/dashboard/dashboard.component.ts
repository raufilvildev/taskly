import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideComponent } from './components/aside/aside.component';
import { UsersService } from '../../services/users.service';
import { AuthorizationService } from '../../services/authorization.service';
import { LightDarkButtonComponent } from '../../shared/components/light-dark-button/light-dark-button.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, AsideComponent, LightDarkButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  usersService = inject(UsersService);
  authorizationService = inject(AuthorizationService);
  isDarkMode = localStorage.getItem('theme') === 'dark';

  user: any = {};

  async ngOnInit() {
    try {
      const token = this.authorizationService.getToken();
      this.user = await this.usersService.getByToken(token as string);
    } catch (error) {
      return;
    }
  }
}
