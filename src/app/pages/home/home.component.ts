// home.component.ts

import { AfterViewInit, Component, ViewChild, NgZone } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, FeaturesComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild(FeaturesComponent) featuresComponent!: FeaturesComponent;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      gsap.registerPlugin(ScrollTrigger);

      const responsive = gsap.matchMedia();

      responsive.add('(max-width: 768px)', () => {
        this.animateHero(true);
        this.animateZoom(false);
      });

      responsive.add('(min-width: 769px)', () => {
        this.animateHero(true);
        this.animateZoom(true);
      });

      // Animación infinita para tags o scrollers
      if (this.featuresComponent) {
        this.animateTags(this.featuresComponent.professorScroller.nativeElement, 1);
        this.animateTags(this.featuresComponent.studentScroller.nativeElement, -1);
      }
    });
  }

  private animateHero(pin: boolean): void {
    const isMobile = window.innerWidth <= 768;
    const titleScale = isMobile ? 1.15 : 1.6;
    const contentY = isMobile ? 100 : 200;
    const buttonsY = isMobile ? 60 : 100;

    gsap.set('.scroll-header__title', {
      scale: titleScale,
      transformOrigin: 'center top',
    });

    gsap.set('.scroll-header__content', {
      opacity: 0,
      y: contentY,
    });

    gsap.set('.scroll-header__buttons', {
      opacity: 0,
      y: buttonsY,
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-header',
        start: 'top top',
        end: pin ? '+=300' : '+=200',
        scrub: true,
        pin: pin,
        invalidateOnRefresh: true,
      },
    });

    timeline.to(
      '.scroll-header__title',
      {
        scale: 1,
        ease: 'none',
      },
      0
    );

    timeline.to(
      '.scroll-header__content',
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
      },
      0.4
    );

    timeline.to(
      '.scroll-header__buttons',
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
      },
      0.5
    );

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
  }

  private animateZoom(isDesktop: boolean): void {
    gsap.set('.scroll-zoom', {
      scale: isDesktop ? 0.8 : 1,
      transformOrigin: 'center center',
    });

    gsap.to('.scroll-zoom', {
      scale: isDesktop ? 1.3 : 1.05,
      y: isDesktop ? 100 : 20,
      scrollTrigger: {
        trigger: '.scroll-zoom',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
        markers: false,
      },
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
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      }
    );
  }
}
