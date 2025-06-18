import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Este es un servicio que permite a todos los componentes suscritos a él, actualizar los cambios en su componente respecto al tema claro / oscuro

  private isDarkModeSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('theme') === 'dark'
  );

  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    // Aplica la clase 'dark' en el html al iniciar el servicio
    const isDark = this.isDarkModeSubject.value;
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.classList.toggle('dark', isDark);
    }
  }

  setDarkMode(isDark: boolean) {
    this.isDarkModeSubject.next(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.classList.toggle('dark', isDark);
    }
  }

  get currentValue(): boolean {
    return this.isDarkModeSubject.value;
  }
}
