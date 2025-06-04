import { Component } from '@angular/core';
import { config } from 'rxjs';
import { constants } from '../../utils/constants/constants.config';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
    appName = constants.appName;
}
