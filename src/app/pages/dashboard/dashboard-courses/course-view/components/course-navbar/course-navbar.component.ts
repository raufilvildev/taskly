import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-navbar',
  imports: [RouterLink],
  templateUrl: './course-navbar.component.html',
  styleUrl: './course-navbar.component.css',
})
export class CourseNavbarComponent {
  router = inject(Router);

  course_uuid = '';

  ngOnInit() {
    this.course_uuid = this.router.url.split('/').at(-1) || '';
  }
}
