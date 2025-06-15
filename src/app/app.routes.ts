import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SignupFormComponent } from './pages/signup/signup-form/signup-form.component';
import { SignupConfirmationComponent } from './pages/signup/signup-confirmation/signup-confirmation.component';
import { LoginFormComponent } from './pages/login/login-form/login-form.component';
import { LoginComponent } from './pages/login/login.component';
import { ChangePasswordEmailRequestComponent } from './pages/login/change-password-email-request/change-password-email-request.component';
import { ChangePasswordConfirmationComponent } from './pages/login/change-password-confirmation/change-password-confirmation.component';
import { ChangePasswordComponent } from './pages/login/change-password/change-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Error404Component } from './pages/error404/error404.component';
import { DashboardCoursesComponent } from './pages/dashboard/dashboard-courses/dashboard-courses.component';
import { DashboardHomeComponent } from './pages/dashboard/dashboard-home/dashboard-home.component';
import { DashboardSettingsComponent } from './pages/dashboard/dashboard-settings/dashboard-settings.component';
import { authorizationGuardPrivate, authorizationGuardPublic } from './guards/authorization.guard';
import { CourseViewComponent } from './pages/dashboard/dashboard-courses/course-view/course-view.component';
import { CoursesGridComponent } from './pages/dashboard/dashboard-courses/courses-grid/courses-grid.component';
import { CourseCalendarComponent } from './pages/dashboard/dashboard-courses/course-view/course-calendar/course-calendar.component';
import { CourseForumComponent } from './pages/dashboard/dashboard-courses/course-view/course-forum/course-forum.component';
import { CourseTasksComponent } from './pages/dashboard/dashboard-courses/course-view/course-tasks/course-tasks.component';
import { CourseHomeComponent } from './pages/dashboard/dashboard-courses/course-view/course-home/course-home.component';
import { DashboardCalendarComponent } from './pages/dashboard/dashboard-calendar/dashboard-calendar.component';
import { DashboardEisenhowerMatrixComponent } from './pages/dashboard/dashboard-eisenhower-matrix/dashboard-eisenhower-matrix.component';
import { courseGuard } from './guards/course.guard';
import { DashboardTasksComponent } from './pages/dashboard/dashboard-tasks/dashboard-tasks.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent, canActivate: [authorizationGuardPublic] },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [authorizationGuardPublic],
    children: [
      { path: '', component: SignupFormComponent, canActivate: [authorizationGuardPublic] },
      {
        path: 'signup_confirmation',
        component: SignupConfirmationComponent,
        canActivate: [authorizationGuardPrivate],
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authorizationGuardPublic],
    children: [
      { path: '', component: LoginFormComponent, canActivate: [authorizationGuardPublic] },
      { path: 'change_password_email_request', component: ChangePasswordEmailRequestComponent },
      {
        path: 'change_password_confirmation',
        component: ChangePasswordConfirmationComponent,
        canActivate: [authorizationGuardPrivate],
      },
      {
        path: 'change_password',
        component: ChangePasswordComponent,
        canActivate: [authorizationGuardPrivate],
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authorizationGuardPrivate],
    canActivateChild: [authorizationGuardPrivate],
    children: [
      { path: '', component: DashboardHomeComponent },
      {
        path: 'courses',
        component: DashboardCoursesComponent,
        children: [
          { path: '', component: CoursesGridComponent },
          {
            path: 'view',
            component: CourseViewComponent,
            children: [
              { path: ':course_uuid', component: CourseHomeComponent, canActivate: [courseGuard] },
              {
                path: 'tasks/:course_uuid',
                component: CourseTasksComponent,
                canActivate: [courseGuard],
              },
              {
                path: 'calendar/:course_uuid',
                component: CourseCalendarComponent,
                canActivate: [courseGuard],
              },
              {
                path: 'forum/:course_uuid',
                component: CourseForumComponent,
                canActivate: [courseGuard],
              },
            ],
          },
        ],
      },
      { path: 'eisenhower_matrix', component: DashboardEisenhowerMatrixComponent },
      { path: 'calendar', component: DashboardCalendarComponent },
      { path: 'tasks', component: DashboardTasksComponent },
      { path: 'settings', component: DashboardSettingsComponent },
    ],
  },
  { path: '**', component: Error404Component },
];
