import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CoursesService } from '../services/courses.service';

export const courseGuard: CanActivateFn = async (route, state) => {
  const coursesService = inject(CoursesService);
  const router = inject(Router);

  const course_uuid = route.params['course_uuid'];
  try {
    await coursesService.getByUuid(course_uuid);
    return true;
  } catch (error) {
    router.navigate(['/dashboard']);
    return false;
  }
};
