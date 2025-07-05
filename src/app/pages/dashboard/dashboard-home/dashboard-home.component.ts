import { Component, inject } from '@angular/core';
import { TableComponent } from '../../../shared/components/calendar/table/calendar-table.component';
import { TasksComponent } from '../../../shared/components/tasks/tasks.component';
import { ITask } from '../../../interfaces/itask.interface';
import { RouterLink } from '@angular/router';
import { DashboardHomeCalendarComponent } from './components/dashboard-home-calendar/dashboard-home-calendar.component';
import { UsersService } from '../../../services/users.service';
import { CoursesService } from '../../../services/courses.service';
import { IGetByTokenUser } from '../../../interfaces/iuser.interface';
import { initUser } from '../../../shared/utils/initializers';
import { ICourse } from '../../../interfaces/icourse.interface';
import { environment } from '../../../environments/environment.test';
import { TasksService } from '../../../services/tasks.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [DashboardHomeCalendarComponent, RouterLink, CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent {
  tasks: ITask[] = [];
  calendarTasks: ITask[] = [];

  usersService = inject(UsersService);
  coursesService = inject(CoursesService);
  taskService = inject(TasksService);

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
    this.tasks = await firstValueFrom(this.taskService.getTasksByPeriod('today'));
    this.calendarTasks = await firstValueFrom(this.taskService.getTasksByPeriod('month'));
    await this.updateGrid();
  } catch (error) {
    console.error('Error al cargar dashboard-home:', error);
  }
}

getPriorityColor(task: ITask): string {
  const urgent = task.is_urgent;
  const important = task.is_important;

  if (urgent && important) return '#ef4444'; // rojo-500
  if (!urgent && important) return '#facc15'; // amarillo-400
  if (urgent && !important) return '#60a5fa'; // azul-400
  return '#34d399'; // verde-400
}

getTimeRemaining(timeEnd: string): string {
  const now = new Date();
  const [h, m] = timeEnd.split(':').map(Number);
  const end = new Date();
  end.setHours(h, m, 0, 0);

  const diff = (end.getTime() - now.getTime()) / 60000; 

  if (diff <= 0) return 'Se pasó la hora';

  const hours = Math.floor(diff / 60);
  const minutes = Math.floor(diff % 60);

  const hoursText = hours > 0 ? ` ${hours} ${hours === 1 ? 'hora' : 'horas'}` : '';
  const minutesText = minutes > 0 ? ` ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}` : '';

  return `Quedan${hoursText}${minutesText}`;
}

get sortedTasks() {
  return this.tasks
    .slice() 
    .sort((a, b) => {
      const [ah, am] = a.time_end.split(':').map(Number);
      const [bh, bm] = b.time_end.split(':').map(Number);
      const aMinutes = ah * 60 + am;
      const bMinutes = bh * 60 + bm;
      return aMinutes - bMinutes;
    });
}


}
