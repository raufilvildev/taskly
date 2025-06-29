import {
  AfterViewInit,
  Component,
  ViewChild
} from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, FeaturesComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild(FeaturesComponent) featuresComponent!: FeaturesComponent;

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);

    this.animateHeroSection();
    this.animateTags(this.featuresComponent.professorScroller.nativeElement, 1);
    this.animateTags(this.featuresComponent.studentScroller.nativeElement, -1);
  }

  private animateHeroSection(): void {
    ScrollTrigger.matchMedia({
      // Pantallas pequeñas
      "(max-width: 768px)": () => {
        gsap.set('.scroll-header__title', {
          scale: 1.3,
          transformOrigin: 'center top'
        });
        gsap.set('.scroll-header__content', {
          opacity: 0,
          y: 100
        });
        gsap.set('.scroll-header__buttons', {
          opacity: 0,
          y: 80
        });

        const scrollTL = gsap.timeline({
          scrollTrigger: {
            trigger: '.scroll-header',
            start: 'top top',
            end: '+=200',
            scrub: true,
            pin: true
          }
        });

        scrollTL.to('.scroll-header__title', {
          scale: 1,
          ease: 'none'
        }, 0);

        scrollTL.to('.scroll-header__content', {
          opacity: 1,
          y: 0,
          ease: 'power2.out'
        }, 0.4);

        scrollTL.to('.scroll-header__buttons', {
          opacity: 1,
          y: 0,
          ease: 'power2.out'
        }, 0.5);
      },

      // Pantallas grandes
      "(min-width: 769px)": () => {
        gsap.set('.scroll-header__title', {
          scale: 1.6,
          transformOrigin: 'center top'
        });
        gsap.set('.scroll-header__content', {
          opacity: 0,
          y: 200
        });
        gsap.set('.scroll-header__buttons', {
          opacity: 0,
          y: 100
        });

        const scrollTL = gsap.timeline({
          scrollTrigger: {
            trigger: '.scroll-header',
            start: 'top top',
            end: '+=300',
            scrub: true,
            pin: true
          }
        });

        scrollTL.to('.scroll-header__title', {
          scale: 1,
          ease: 'none'
        }, 0);

        scrollTL.to('.scroll-header__content', {
          opacity: 1,
          y: 0,
          ease: 'power2.out'
        }, 0.5);

        scrollTL.to('.scroll-header__buttons', {
          opacity: 1,
          y: 0,
          ease: 'power2.out'
        }, 0.6);
      }
    });

    gsap.to('.scroll-arrow', {
      opacity: 0,
      scale: 0.5,
      scrollTrigger: {
        trigger: '.scroll-header',
        start: 'top top+=10',
        end: '+=10',
        scrub: true
      }
    });

    gsap.set('.scroll-zoom', {
      scale: 0.8,
      transformOrigin: 'center center'
    });

    gsap.to('.scroll-zoom', {
      scale: 1.3,
      y: 100,
      scrollTrigger: {
        trigger: '.scroll-zoom',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
        markers: false
      }
    });
  }

  private animateTags(scroller: HTMLElement, direction: 1 | -1): void {
    const totalWidth = scroller.scrollWidth / 2;
    const duration = totalWidth / 50;

    gsap.fromTo(
      scroller,
      { x: 0 },
      {
        x: direction === 1 ? -totalWidth : totalWidth,
        duration,
        ease: 'linear',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
        }
      }
    );
  }
}
