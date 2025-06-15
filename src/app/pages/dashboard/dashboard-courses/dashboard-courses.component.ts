import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IGetByTokenUser } from '../../../interfaces/iuser.interface';
import { initUser } from '../../../shared/utils/initializers';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-courses',
  imports: [RouterOutlet],
  templateUrl: './dashboard-courses.component.html',
  styleUrl: './dashboard-courses.component.css',
})
export class DashboardCoursesComponent {
  usersService = inject(UsersService);

  user: IGetByTokenUser = initUser();

  async ngOnInit() {
    try {
      this.user = await this.usersService.getByToken();
    } catch (error) {
      return;
    }
  }
}
