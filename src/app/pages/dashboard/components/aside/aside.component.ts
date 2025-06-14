import { Component, inject, Input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../../../services/authorization.service';
import { IGetByTokenUser } from '../../../../interfaces/iuser.interface';
import { ThemeService } from '../../../../services/theme.service';
import { Subscription } from 'rxjs';
import { initUser } from '../../../../shared/utils/initializers';

@Component({
  selector: 'app-aside',
  imports: [RouterLink],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  authorizationService = inject(AuthorizationService);
  themeService = inject(ThemeService);
  router = inject(Router);

  @Input() user: IGetByTokenUser = initUser();

  isDarkMode = signal(false);
  showList = false;

  private themeSub?: Subscription;

  getIcon(name: string): string {
    return `${name}${this.isDarkMode() ? '_light' : ''}.svg`;
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
  }

  ngOnDestroy() {
    // Cancelar suscripción para evitar memory leaks
    this.themeSub?.unsubscribe();
  }
}
