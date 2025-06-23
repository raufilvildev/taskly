import { Component, inject, Input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../../../services/authorization.service';
import { IGetByTokenUser } from '../../../../interfaces/iuser.interface';
import { ThemeService } from '../../../../services/theme.service';
import { DashboardLayoutService } from '../../../../services/dashboard-layout.service';
import { Subscription } from 'rxjs';
import { initUser } from '../../../../shared/utils/initializers';
import { environment } from '../../../../environments/environment.test';
import { UsersService } from '../../../../services/users.service';

interface NavigationItem {
  route: string[];
  icon: string;
  label: string;
  alt: string;
}

@Component({
  selector: 'app-aside',
  imports: [RouterLink],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  authorizationService = inject(AuthorizationService);
  themeService = inject(ThemeService);
  UserService = inject(UsersService);
  dashboardLayoutService = inject(DashboardLayoutService);
  router = inject(Router);

  @Input() user: IGetByTokenUser = initUser();

  private themeSub?: Subscription;
  private userSub?: Subscription;
  User = initUser();

  isDarkMode = signal(false);
  showList = false;
  profile_image_endpoint = `${environment.host}/uploads/users/`;

  navigationItems: NavigationItem[] = [
    { route: ['/dashboard'], icon: 'home', label: 'Inicio', alt: 'Icono de inicio' },
    {
      route: ['/dashboard', 'calendar'],
      icon: 'calendar',
      label: 'Calendario',
      alt: 'Icono de calendario',
    },
    {
      route: ['/dashboard', 'eisenhower_matrix'],
      icon: 'matrix',
      label: 'Matriz de Eisenhower',
      alt: 'Icono de matriz de Eisenhower',
    },
    { route: ['/dashboard', 'tasks'], icon: 'tasks', label: 'Mis tareas', alt: 'Icono de tareas' },
    {
      route: ['/dashboard', 'courses'],
      icon: 'course',
      label: 'Mis cursos',
      alt: 'Icono de cursos',
    },
  ];

  getIcon(name: string): string {
    return `${name}${this.isDarkMode() ? '_light' : ''}.svg`;
  }

  isCollapsed() {
    return this.dashboardLayoutService.isAsideCollapsed();
  }

  toggleCollapse() {
    this.dashboardLayoutService.toggleAside();
  }

  logout() {
    this.authorizationService.removeToken();
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    // Inicializa el valor del tema actual
    this.isDarkMode.set(this.themeService.currentValue);

    // Suscríbete al observable para actualizar el signal cuando el tema cambie
    this.themeSub = this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode.set(isDark);
    });

    this.userSub = this.UserService.currentUser$.subscribe((u) => {
      this.user = u;
    });
  }

  ngOnDestroy() {
    // Cancelar suscripción para evitar memory leaks
    this.themeSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }
}
