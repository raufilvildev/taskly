import { Component } from '@angular/core';
import { constants } from '../../utils/constants/constants.config';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LightDarkButtonComponent } from '../buttons/light-dark-button/light-dark-button.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, MatIconModule, LightDarkButtonComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  appName = constants.appName;
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  readonly MENU_LINKS = [
    {
      label: 'Iniciar sesión',
      routerLink: '/login',
      classes: 'btn ',
      mobileClasses:
        'px-4 py-2 rounded-lg border-2 border-white text-white hover:bg-white hover:text-custom-accent transition-all duration-300 w-11/12 text-center',
    },
    {
      label: 'Pruébalo gratis',
      routerLink: '/signup',
      classes:
        'px-4 py-2 rounded-lg bg-white text-custom-accent font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl',
      mobileClasses:
        'px-4 py-2 rounded-lg bg-white text-custom-accent font-medium hover:bg-opacity-90 transition-all duration-300 w-11/12 text-center shadow-lg hover:shadow-xl',
    },
  ];
}
