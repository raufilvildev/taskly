import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IGetByTokenUser } from '../../../interfaces/iuser.interface';
import { initUser } from '../../../shared/utils/initializers';
import { AuthorizationService } from '../../../services/authorization.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-courses',
  imports: [RouterOutlet],
  templateUrl: './dashboard-courses.component.html',
  styleUrl: './dashboard-courses.component.css',
})
export class DashboardCoursesComponent {
  usersService = inject(UsersService);
  authorizationService = inject(AuthorizationService);

  user: IGetByTokenUser = initUser();

  async ngOnInit() {
    const token = this.authorizationService.getToken();

    try {
      this.user = await this.usersService.getByToken(token);
    } catch (error) {
      return;
    }
  }
}
