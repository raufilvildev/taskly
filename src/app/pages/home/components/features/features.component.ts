import { AfterViewInit, Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css',
})
export class FeaturesComponent implements AfterViewInit {
  professorTags = [
    'Crea tus cursos',
    'Gestiona tareas',
    'Habla con tu clase',
    'Organiza con calendario',
    'Descarga la planificación',
    'Prioriza con Eisenhower',
  ];

  studentTags = [
    'Aprende a tu ritmo',
    'Cursos a medida',
    'Participa en foros',
    'Planifica tu estudio',
    'Organiza tus tareas',
    'Enfócate con Pomodoro',
  ];

  @ViewChild('professorWrapper') professorWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('studentWrapper') studentWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('professorScroller') professorScroller!: ElementRef<HTMLDivElement>;
  @ViewChild('studentScroller') studentScroller!: ElementRef<HTMLDivElement>;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);

    this.ngZone.runOutsideAngular(() => {
      const mm = gsap.matchMedia();

      // Escritorio
      mm.add('(min-width: 769px)', () => {
        if (
          !this.professorWrapper ||
          !this.studentWrapper ||
          !this.professorScroller ||
          !this.studentScroller
        ) return;

        const profEl = this.professorWrapper.nativeElement;
        const studEl = this.studentWrapper.nativeElement;
        const profScrollerEl = this.professorScroller.nativeElement;
        const studScrollerEl = this.studentScroller.nativeElement;

        // Calcula 10% del ancho visible del contenedor 
        const fadeMarginProf = profEl.offsetWidth * 0.1;
        const fadeMarginStud = studEl.offsetWidth * 0.1;

        gsap.set(profScrollerEl, { x: fadeMarginProf + 150, opacity: 0.5 });
        gsap.set(studScrollerEl, { x: -fadeMarginStud - 150, opacity: 0.5 });

        // Ambas animaciones usan el mismo trigger y los mismos valores de start/end para sincronizarse
        const scrollStart = 'top 80%'; 
        const scrollEnd = 'top 20%';  

        const trigger = profEl; // Usamos el mismo trigger para ambos

        const profAnim = gsap.to(profScrollerEl, {
          x: 0,
          opacity: 1,
          ease: 'power2',
          scrollTrigger: {
            trigger,
            start: scrollStart,
            end: scrollEnd,
            scrub: 2,
            markers: false,
          },
        });

        const studAnim = gsap.to(studScrollerEl, {
          x: 0,
          opacity: 1,
          ease: 'power2',
          scrollTrigger: {
            trigger,
            start: scrollStart,
            end: scrollEnd,
            scrub: 2,
            markers: false,
          },
        });

        return () => {
          profAnim.scrollTrigger?.kill();
          profAnim.kill();
          studAnim.scrollTrigger?.kill();
          studAnim.kill();
          gsap.set(profScrollerEl, { clearProps: 'all' });
          gsap.set(studScrollerEl, { clearProps: 'all' });
        };
      });

      // Móvil
      mm.add('(max-width: 768px)', () => {
        if (
          !this.professorWrapper ||
          !this.studentWrapper ||
          !this.professorScroller ||
          !this.studentScroller
        ) return;

        const profEl = this.professorWrapper.nativeElement;
        const studEl = this.studentWrapper.nativeElement;
        const profScrollerEl = this.professorScroller.nativeElement;
        const studScrollerEl = this.studentScroller.nativeElement;

        const getScrollerWidth = (scrollerEl: HTMLElement): number => {
          let totalWidth = 0;
          Array.from(scrollerEl.children).forEach((child: Element) => {
            totalWidth +=
              (child as HTMLElement).offsetWidth +
              parseFloat(getComputedStyle(child as HTMLElement).marginRight || '0');
          });
          return totalWidth;
        };

        const profContentWidth = getScrollerWidth(profScrollerEl);
        const studContentWidth = getScrollerWidth(studScrollerEl);
        const viewportWidth = window.innerWidth;

        gsap.set(profScrollerEl, { x: viewportWidth, opacity: 0.5 });
        gsap.set(studScrollerEl, { x: -viewportWidth, opacity: 0.5 });

        const profAnim = gsap.to(profScrollerEl, {
          x: -(profContentWidth - viewportWidth),
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: profEl,
            start: 'top 65%',
            end: 'top 50%',
            scrub: 2,
            invalidateOnRefresh: true,
          },
        });

        const studAnim = gsap.to(studScrollerEl, {
          x: studContentWidth - viewportWidth,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: studEl,
            start: 'top 85%',
            end: 'top 10%',
            scrub: 2,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          profAnim.scrollTrigger?.kill();
          profAnim.kill();
          studAnim.scrollTrigger?.kill();
          studAnim.kill();
          gsap.set(profScrollerEl, { clearProps: 'all' });
          gsap.set(studScrollerEl, { clearProps: 'all' });
        };
      });
    });
  }
}
