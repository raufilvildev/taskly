import { AfterViewInit, Component, NgZone } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements AfterViewInit {
  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);

    this.ngZone.runOutsideAngular(() => {
      const mm = gsap.matchMedia();

      // Media query para móviles (max-width 768px)
      mm.add("(max-width: 768px)", () => {
        // Set inicial de elementos
        gsap.set('.scroll-header__title', { scale: 1.3, transformOrigin: 'center top', y: 100 });
        gsap.set('.scroll-header__content', { opacity: 0, y: 100 });
        gsap.set('.scroll-header__buttons', { opacity: 0, y: 80 });
        gsap.set('.scroll-arrow', { opacity: 1, scale: 1, transformOrigin: 'center center', y:100 });
        gsap.set('.scroll-zoom', { opacity: 0, scale: 0.8, transformOrigin: 'center center', y:30 });

        // Timeline scroll para header
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.scroll-header',
            start: 'top top',
            end: '+=200',
            scrub: true,
            pin: true,
          },
        });

        tl.to('.scroll-header__title', { scale: 1, ease: 'none', y: 0 }, 0)
          .to('.scroll-header__content', { opacity: 1, y: 0, ease: 'power2.out' }, 0.4)
          .to('.scroll-header__buttons', { opacity: 1, y: 0, ease: 'power2.out' }, 0.5);

        // Animación flecha móvil
          gsap.to('.scroll-arrow', {
          opacity: 0,
          scale: 0.5,
          scrollTrigger: {
            trigger: '.scroll-header',
            start: 'top top+=50',
            end: '+=10',
            scrub: true,
          },
        });

        // Animación zoom scroll móvil
        gsap.to('.scroll-zoom', {
          opacity: 1,
          scale: 1,
          y: 0,
          scrollTrigger: {
            trigger: '.scroll-zoom',
            start: 'top center',       
            end: '+=80',           
            scrub: true,
            pin: true,             
            markers: false,
          },
        });

        return () => {
          tl.scrollTrigger?.kill();         // Elimina el ScrollTrigger ligado al timeline (si existe)
          tl.kill();                       // Elimina el timeline y sus animaciones
          ScrollTrigger.getAll().forEach(st => st.kill());  // Elimina todos los ScrollTriggers activos (animaciones independientes)
        };

      });

      // Media query para escritorio 
      mm.add("(min-width: 769px)", () => {
        gsap.set('.scroll-header__title', { scale: 1.6, transformOrigin: 'center top' });
        gsap.set('.scroll-header__content', { opacity: 0, y: 200 });
        gsap.set('.scroll-header__buttons', { opacity: 0, y: 100 });
        gsap.set('.scroll-arrow', { opacity: 1, scale: 1, transformOrigin: 'center center' });
        gsap.set('.scroll-zoom', {opacity: 0, scale: 0.8, transformOrigin: 'center center' });


        // Timeline scroll para header
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.scroll-header',
            start: 'top top',
            end: '+=300',
            scrub: true,
            pin: true,
          },
        });

        tl.to('.scroll-header__title', { scale: 1, ease: 'none' }, 0)
          .to('.scroll-header__content', { opacity: 1, y: 0, ease: 'power2.out' }, 0.5)
          .to('.scroll-header__buttons', { opacity: 1, y: 0, ease: 'power2.out' }, 0.6);

        // Animación flecha escritorio
        gsap.to('.scroll-arrow', {
          opacity: 0,
          scale: 0.5,
          scrollTrigger: {
            trigger: '.scroll-header',
            start: 'top top+=10',
            end: '+=10',
            scrub: true,
          },
        });

        // Animación zoom scroll escritorio
        gsap.to('.scroll-zoom', {
          opacity:1,
          scale: 1.1,
          y: 100,
          scrollTrigger: {
            trigger: '.scroll-zoom',
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
            markers: false,
          },
        });

        return () => {
          tl.scrollTrigger?.kill();       // Elimina ScrollTrigger del timeline (si existe)
          tl.kill();                     // Elimina el timeline y animaciones
          ScrollTrigger.getAll().forEach(st => st.kill());  // Elimina todos los ScrollTriggers activos
        };

      });
    });
  }
}
