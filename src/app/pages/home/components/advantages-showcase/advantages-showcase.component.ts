import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AdventagesListComponent } from './components/adventages-list/adventages-list.component';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AdvantageItem {
  title: string;
  description: string;
  image: string;
}

type AdvantageType = 'teacher' | 'alumn';

@Component({
  selector: 'app-advantages-showcase',
  templateUrl: './advantages-showcase.component.html',
  standalone: true,
  imports: [CommonModule, AdventagesListComponent],
})
export class AdvantagesShowcaseComponent implements AfterViewInit {
  advantageTeacherItems: AdvantageItem[] = [
    {
      title: 'Crea cursos fácilmente',
      description:
        '¿Eres profesor? Diseña y publica tus propios cursos en minutos. Nuestra plataforma te da el control total: estructura módulos, añade lecciones interactivas y comparte tu conocimiento con cientos de estudiantes sin complicaciones.',
      image: '/assets/images/ejemplo_1.png',
    },
    {
      title: 'Gestiona tareas sin esfuerzo',
      description:
        'Asigna tareas, pon fechas límite y da retroalimentación directamente desde la app. Olvídate del caos: organiza tu aula virtual con fluidez y ahorra tiempo en cada clase',
      image: '/assets/images/tareas-preview.jpg',
    },
    {
      title: 'Calendario que te organiza la vida',
      description:
        'Todo lo que necesitas, en un solo lugar: entregas, clases, recordatorios y eventos. Visualiza tu semana académica con claridad y nunca más pierdas una fecha importante.',
      image: '/assets/images/material-preview.jpg',
    },
    {
      title: 'Conecta con tu comunidad',
      description:
        '¿Dudas? ¿Ideas? ¿Preguntas? Participa en foros temáticos o chatea en tiempo real con tus compañeros y profesores. Aprende, colabora y crece en comunidad.',
      image: '/assets/images/calendario-preview.jpg',
    },
    {
      title: 'Exporta y comparte tus planes',
      description:
        'Profesores: genera un PDF profesional de tu curso y compártelo fácilmente. Estudiantes: guarda tu cronograma de estudio y llévalo contigo a todas partes, incluso sin conexión.',
      image: '/assets/images/foro-preview.jpg',
    },
    {
      title: 'Estudia con enfoque gracias al modo Pomodoro',
      description:
        'Evita distracciones y maximiza tu concentración. Activa el modo Pomodoro y estudia con técnica probada: bloques de 25 minutos que disparan tu productividad.',
      image: '/assets/images/progreso-preview.jpg',
    },
  ];

  advantageAlumnItems: AdvantageItem[] = [
    {
      title: 'Aprende a tu ritmo',
      description:
        'Accede a cursos diseñados por expertos y estudia cuando quieras, desde cualquier dispositivo. Tú decides el ritmo y el horario que mejor se adapta a tu vida.',
      image: '/assets/images/ejemplo_1.png',
    },
    {
      title: 'Organiza tus tareas fácilmente',
      description:
        'Visualiza todas tus tareas, fechas de entrega y actividades en un solo lugar. Recibe recordatorios y mantén el control de tu progreso académico sin estrés.',
      image: '/assets/images/tareas-preview.jpg',
    },
    {
      title: 'Calendario académico integrado',
      description:
        'Consulta tu calendario para no perderte ninguna clase, entrega o evento importante. Planifica tu semana y optimiza tu tiempo de estudio.',
      image: '/assets/images/material-preview.jpg',
    },
    {
      title: 'Participa en la comunidad',
      description:
        'Resuelve dudas, comparte ideas y colabora con otros estudiantes y profesores en foros y chats en tiempo real. Aprende y crece junto a tu comunidad educativa.',
      image: '/assets/images/calendario-preview.jpg',
    },
    {
      title: 'Descarga y comparte tus apuntes',
      description:
        'Guarda tus materiales y cronogramas en PDF para consultarlos sin conexión o compartirlos fácilmente con tus compañeros.',
      image: '/assets/images/foro-preview.jpg',
    },
    {
      title: 'Mejora tu concentración con el modo Pomodoro',
      description:
        'Utiliza la técnica Pomodoro para estudiar en bloques de tiempo y aumentar tu productividad. Mantente enfocado y alcanza tus metas académicas.',
      image: '/assets/images/progreso-preview.jpg',
    },
  ];

  currentType: AdvantageType = 'teacher';
  currentIndex = 0;

  @ViewChild('toggleBall', { static: false }) toggleBall!: ElementRef<HTMLSpanElement>;

  private ballTimeline?: gsap.core.Timeline;

  ngAfterViewInit() {
    this.animateBall();
  }

  get currentArray(): AdvantageItem[] {
    return this.currentType === 'teacher' ? this.advantageTeacherItems : this.advantageAlumnItems;
  }

  get selectedItem(): AdvantageItem {
    return this.currentArray[this.currentIndex];
  }

  toggleRole() {
    this.currentType = this.currentType === 'teacher' ? 'alumn' : 'teacher';
    this.currentIndex = 0;

    if (this.ballTimeline && this.ballTimeline.isActive()) {
      this.ballTimeline.kill();
      gsap.set(this.toggleBall.nativeElement, { x: 0 });
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.currentArray.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.currentArray.length) % this.currentArray.length;
  }

  animateBall(): void {
    if (!this.toggleBall) return;

    this.ballTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.toggleBall.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    this.ballTimeline.to(this.toggleBall.nativeElement, {
      x: 50,
      duration: 0.3,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 5,
    });
  }
}
