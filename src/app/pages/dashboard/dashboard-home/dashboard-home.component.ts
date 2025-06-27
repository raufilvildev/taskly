import { Component, inject } from '@angular/core';
import { TableComponent } from "../../../shared/components/calendar/table/calendar-table.component";
import { TasksComponent } from "../../../shared/components/tasks/tasks.component";
import { TaskListComponent } from '../../../shared/components/task-list/task-list.component';
import { ITask } from '../../../interfaces/itask';
import { RouterLink } from '@angular/router';
import { DashboardHomeCalendarComponent } from './components/dashboard-home-calendar/dashboard-home-calendar.component';
import { UsersService } from '../../../services/users.service';
import { CoursesService } from '../../../services/courses.service';
import { IGetByTokenUser } from '../../../interfaces/iuser.interface';
import { initUser } from '../../../shared/utils/initializers';
import { ICourse } from '../../../interfaces/icourse.interface';
import { environment } from '../../../environments/environment.test';



@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [TaskListComponent, DashboardHomeCalendarComponent, RouterLink],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent {
  tasks: ITask[] = [];

  usersService = inject(UsersService);
  coursesService = inject(CoursesService);

  user: IGetByTokenUser = initUser();
  courses: ICourse[] = [];

  course_image_endpoint = `${environment.host}/uploads/courses/`;

  async updateGrid() {
    try {
      this.courses = await this.coursesService.getAll();
    } catch (error) {
      return;
    }
  }

  async ngOnInit() {
    try {
      this.user = await this.usersService.getByToken();
      await this.updateGrid();
    } catch (error) {
      return;
    }
  }

}
