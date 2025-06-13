import { Component, EventEmitter, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [RouterOutlet],
  templateUrl: './dashboard-courses.component.html',
  styleUrl: './dashboard-courses.component.css',
})
export class DashboardCoursesComponent {}
