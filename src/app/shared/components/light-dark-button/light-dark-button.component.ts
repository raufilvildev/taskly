import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-light-dark-button',
  imports: [MatIconModule],
  templateUrl: './light-dark-button.component.html',
  styleUrl: './light-dark-button.component.css',
})
export class LightDarkButtonComponent {
  isDarkMode = false;

  htmlElement = document.querySelector('html');

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.htmlElement?.classList.toggle('dark');
  }

  ngOnInit() {
    // Inicializa el modo según localStorage
    const theme = localStorage.getItem('theme');
    this.isDarkMode = theme === 'dark';
    if (this.isDarkMode) {
      this.htmlElement?.classList.add('dark');
    } else {
      this.htmlElement?.classList.remove('dark');
    }
  }
}
