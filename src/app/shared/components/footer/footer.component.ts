import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { constants } from '../../utils/constants/constants.config';
import { ThemeService } from '../../../services/theme.service';
import { Subscription } from 'rxjs';

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
  private themeService = inject(ThemeService);
  private sub?: Subscription;

  ngOnInit(): void {
this.sub = this.themeService.isDarkMode$.subscribe(value => {
      this.isDarkMode = value;
    });
  }
}
