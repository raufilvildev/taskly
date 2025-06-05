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

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent },
  {
    path: 'signup',
    component: SignupComponent,
    children: [
      { path: '', component: SignupFormComponent },
      { path: 'signup_confirmation', component: SignupConfirmationComponent },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    children: [
      { path: '', component: LoginFormComponent },
      { path: 'change_password_email_request', component: ChangePasswordEmailRequestComponent },
      { path: 'change_password_confirmation', component: ChangePasswordConfirmationComponent },
      { path: 'change_password', component: ChangePasswordComponent },
    ],
  },
  {
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    { path: '', component: DashboardHomeComponent}, 
    { path: 'courses', component: CoursesComponent },
  ],
},

  { path: '**', component: Error404Component },
];
