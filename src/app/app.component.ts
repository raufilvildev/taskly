import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'taskly';
  router = inject(Router);
  showHeaderAndFooter = true;

  privateRoutes = ['/dashboard'];

  /*
  Esta función captura la ruta en la que nos encontramos actualmente. 
  Si la ruta actual contiene dashboard (privateRoutes), ocultaremos 
  tanto header como footer (showHeaderAndFooter = false)
  */
  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.showHeaderAndFooter = !this.privateRoutes.some((route) => url.startsWith(route));
      });
  }
}
