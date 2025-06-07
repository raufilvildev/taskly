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
import { CoursesComponent } from './pages/dashboard/courses/courses.component';
import { DashboardHomeComponent } from './pages/dashboard/dashboard-home/dashboard-home.component';
import { DashboardSettingsComponent } from './pages/dashboard/dashboard-settings/dashboard-settings.component';
import { authorizationGuardPrivate, authorizationGuardPublic } from './guards/authorization.guard';
<<<<<<< HEAD
import { DashboardListViewComponent } from './pages/dashboard/dashboard-list-view/dashboard-list-view.component';
=======
import { CourseViewComponent } from './pages/dashboard/courses/course-view/course-view.component';
import { CoursesGridComponent } from './pages/dashboard/courses/courses-grid/courses-grid.component';
>>>>>>> origin/main

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
        component: CoursesComponent,
        children: [
          { path: '', component: CoursesGridComponent },
          { path: 'view/:course_uuid', component: CourseViewComponent },
        ],
      },
      { path: 'settings', component: DashboardSettingsComponent },
    ],
  },
  { path: 'dashboard-list-view', component: DashboardListViewComponent },
  { path: '**', component: Error404Component },
];
