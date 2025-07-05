import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-call-to-action',
  standalone: true,
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css'],
})
export class CallToActionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ctaSection') ctaSection!: ElementRef<HTMLElement>;

  private mm!: gsap.MatchMedia;

  ngAfterViewInit() {
    this.mm = gsap.matchMedia();

    this.mm.add('(max-width: 768px)', () => {
      const el = this.ctaSection.nativeElement;
      gsap.set(el, { opacity: 0, y: 30 });
      return gsap.to(el, {
        opacity: 1,
        y: 0,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 60%',
          scrub: true,
          markers: false,
        },
      });
    });

    this.mm.add('(min-width: 769px)', () => {
      const el = this.ctaSection.nativeElement;
      gsap.set(el, { opacity: 0, y: 50 });
      return gsap.to(el, {
        opacity: 1,
        y: 0,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 60%',
          scrub: true,
          markers: false,
        },
      });
    });
  }

  ngOnDestroy() {
    this.mm && this.mm.revert();
  }
}
