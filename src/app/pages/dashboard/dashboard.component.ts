import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideComponent } from './components/aside/aside.component';
import { UsersService } from '../../services/users.service';
import { AuthorizationService } from '../../services/authorization.service';
import { LightDarkButtonComponent } from '../../shared/components/light-dark-button/light-dark-button.component';
import { IGetByTokenUser } from '../../interfaces/iuser.interface';
import { initUser } from '../../shared/utils/initializers';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, AsideComponent, LightDarkButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  usersService = inject(UsersService);
  authorizationService = inject(AuthorizationService);

  user: IGetByTokenUser = initUser();

  async ngOnInit() {
    try {
      const token = this.authorizationService.getToken();
      this.user = await this.usersService.getByToken(token);
    } catch (error) {
      return;
    }
  }
}
