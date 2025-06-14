import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-light-dark-button',
  imports: [MatIconModule],
  templateUrl: './light-dark-button.component.html',
  styleUrl: './light-dark-button.component.css',
})
export class LightDarkButtonComponent {
  themeService = inject(ThemeService);
  icon = 'dark_mode';

  toggleTheme() {
    const newValue = !this.themeService.currentValue;
    this.themeService.setDarkMode(newValue);
  }

  private updateIcon(isDark: boolean) {
    this.icon = isDark ? 'light_mode' : 'dark_mode';
  }

  ngOnInit() {
    this.updateIcon(this.themeService.currentValue);

    // Suscripción para actualizar icono al cambiar tema desde cualquier lado
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.updateIcon(isDark);
    });
  }
}
