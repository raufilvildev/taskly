import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { constants } from '../../utils/constants/constants.config';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  appName = constants.appName;
  currentYear = new Date().getFullYear();
  isDarkMode = false;

  ngOnInit(): void {
    this.isDarkMode = document.documentElement.classList.contains('dark');
    const observer = new MutationObserver(() => {
      this.isDarkMode = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
}
