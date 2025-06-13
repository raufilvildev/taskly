import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../../../services/authorization.service';
import { IUser } from '../../../../interfaces/iuser.interface';

@Component({
  selector: 'app-aside',
  imports: [RouterLink],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  authorizationService = inject(AuthorizationService);
  router = inject(Router);

  @Input() user!: IUser;

  @Input() isDarkMode = false;
  showList = false;
  htmlElement = document.querySelector('html');

  logout() {
    this.authorizationService.removeToken();
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    if (this.isDarkMode) {
      this.htmlElement?.classList.add('dark');
    } else {
      this.htmlElement?.classList.remove('dark');
    }
  }
}
