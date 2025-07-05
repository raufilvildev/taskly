import { AfterViewInit, Component, NgZone, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../services/theme.service';


gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'], // corregido: styleUrls en plural
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  isDarkMode = false;
  private sub?: Subscription;
  private ngZone = inject(NgZone);
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.sub = this.themeService.isDarkMode$.subscribe(value => {
      this.isDarkMode = value;
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const mm = gsap.matchMedia();

      // Media query para móviles (max-width 768px)
      mm.add("(max-width: 768px)", () => {
        gsap.set('.scroll-header__title', { scale: 1.3, transformOrigin: 'center top', y: 100 });
        gsap.set('.scroll-header__content', { opacity: 0, y: 100 });
        gsap.set('.scroll-header__buttons', { opacity: 0, y: 80 });
        gsap.set('.scroll-arrow', { opacity: 1, scale: 1, transformOrigin: 'center center', y: 100 });
        gsap.set('.scroll-zoom', { opacity: 0, scale: 0.8, transformOrigin: 'center center', y: 30 });

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
          tl.scrollTrigger?.kill();
          tl.kill();
          ScrollTrigger.getAll().forEach(st => st.kill());
        };
      });

      // Media query para escritorio (min-width 769px)
      mm.add("(min-width: 769px)", () => {
        gsap.set('.scroll-header__title', { scale: 1.4, transformOrigin: 'center top' });
        gsap.set('.scroll-header__content', { opacity: 0, y: 200 });
        gsap.set('.scroll-header__buttons', { opacity: 0, y: 100 });
        gsap.set('.scroll-arrow', { opacity: 1, scale: 1, transformOrigin: 'center center' });
        gsap.set('.scroll-zoom', { opacity: 0, scale: 0.7, transformOrigin: 'center center' });

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

        gsap.to('.scroll-zoom', {
          opacity: 1,
          scale: 1.2,
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
          tl.scrollTrigger?.kill();
          tl.kill();
          ScrollTrigger.getAll().forEach(st => st.kill());
        };
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
