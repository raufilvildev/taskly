import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideComponent } from './components/aside/aside.component';
import { UsersService } from '../../services/users.service';
import { IGetByTokenUser } from '../../interfaces/iuser.interface';
import { initUser } from '../../shared/utils/initializers';
import { LightDarkButtonComponent } from '../../shared/components/buttons/light-dark-button/light-dark-button.component';
import { DashboardLayoutService } from '../../services/dashboard-layout.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, AsideComponent, LightDarkButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  usersService = inject(UsersService);
  dashboardLayoutService = inject(DashboardLayoutService);

  user: IGetByTokenUser = initUser();

  get isAsideCollapsed(): boolean {
    return this.dashboardLayoutService.isAsideCollapsed();
  }

  async ngOnInit() {
    try {
      this.user = await this.usersService.getByToken();
    } catch (error) {
      return;
    }
  }
}
