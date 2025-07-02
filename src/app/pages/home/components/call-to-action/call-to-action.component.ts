import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { RouterLink } from '@angular/router';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-call-to-action',
  imports: [RouterLink],
  templateUrl: './call-to-action.component.html',
  styleUrl: './call-to-action.component.css'
})
export class CallToActionComponent implements AfterViewInit {
  @ViewChild('ctaSection') ctaSection!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    const el = this.ctaSection.nativeElement;

    gsap.set(el, { opacity: 0, y: 50 });

    gsap.to(el, {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 60%',
        scrub: true,
        markers: false,
      },
    });
  }
}