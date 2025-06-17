import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CourseNavbarComponent } from './components/course-navbar/course-navbar.component';

@Component({
  selector: 'app-course-view',
  imports: [RouterOutlet, CourseNavbarComponent],
  templateUrl: './course-view.component.html',
  styleUrl: './course-view.component.css',
})
export class CourseViewComponent {}
