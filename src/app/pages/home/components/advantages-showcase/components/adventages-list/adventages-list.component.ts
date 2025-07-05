import { Component, Input, Output, EventEmitter, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AdvantageItem {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-adventages-list',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './adventages-list.component.html',
})
export class AdventagesListComponent implements AfterViewInit {
  @Input() item!: AdvantageItem;
  @Input() type!: 'teacher' | 'alumn';
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  @ViewChild('advantagesList', { static: false }) advantagesList!: ElementRef<HTMLElement>;

  private mm!: gsap.MatchMedia;

  ngAfterViewInit(): void {
    this.animateAdvantagesList();
  }

  animateAdvantagesList() {
    if (!this.advantagesList) return;

    this.mm = gsap.matchMedia();

    this.mm.add("(max-width: 768px)", () => {
      gsap.set(this.advantagesList.nativeElement, { opacity: 0.5, y: 40, scale: 0.8 });

      const anim = gsap.to(this.advantagesList.nativeElement, {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: this.advantagesList.nativeElement,
          start: 'top 85%',
          end: 'top 30%',
          scrub: true,
          toggleActions: 'play none none reset',
          markers: false,
        }
      });

      return () => {
        anim.scrollTrigger?.kill();
        anim.kill();
      };
    });

    this.mm.add("(min-width: 769px)", () => {
      gsap.set(this.advantagesList.nativeElement, { opacity: 0.5, y: 20, scale: 0.3 });

      const anim = gsap.to(this.advantagesList.nativeElement, {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: this.advantagesList.nativeElement,
          start: 'top 80%',
          end: 'top 30%',
          scrub: true,
          toggleActions: 'play none none reset',
          markers: false,
        }
      });

      return () => {
        anim.scrollTrigger?.kill();
        anim.kill();
      };
    });
  }
}
