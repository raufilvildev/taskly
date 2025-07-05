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
        '¿Eres profesor? Diseña y publica tus propios cursos en minutos. Comparte tu conocimiento con cientos de estudiantes sin complicaciones técnicas ni barreras.',
      image: 'crear-curso.png',
    },
    {
      title: 'Gestiona tareas sin esfuerzo',
      description:
        'Asigna tareas, establece fechas límite y proporciona retroalimentación directamente desde la app. Centraliza toda la información del curso y automatiza recordatorios para evitar olvidos. Organiza tu aula virtual con fluidez y ahorra tiempo valioso en cada clase, dedicándote a lo que realmente importa: enseñar.',
      image: 'tareas-profesores.png',
    },
    {
      title: 'Calendario que te organiza la vida',
      description:
        'Todo lo que necesitas, en un solo lugar: entregas, reuniones, recordatorios y eventos académicos. Nuestro calendario inteligente se sincroniza con tus cursos y te ofrece una vista clara y ordenada de tu semana. Nunca más pierdas una fecha importante ni olvides una clase.',
      image: 'calendario-preview.png',
    },
    {
      title: 'Conecta con tu comunidad',
      description:
        '¿Dudas? ¿Ideas? ¿Preguntas? Participa en foros temáticos, comenta publicaciones o chatea en tiempo real con alumnos y colegas. Fomenta el diálogo, el aprendizaje colaborativo y construye una comunidad educativa activa, motivada y conectada más allá del aula.',
      image: 'foro-profesor.png',
    },
    {
      title: 'Exporta y comparte tus planes',
      description:
        'Genera un PDF profesional de tu curso con estructura, cronograma y objetivos claros. Compártelo con instituciones, alumnos o guárdalo como respaldo.',
      image: 'pdf-curso.png',
    },
    {
      title: 'Prioriza con la matriz de Eisenhower',
      description:
        'Organiza tus tareas según su urgencia e importancia con la matriz de Eisenhower. Decide qué hacer, qué programar, qué delegar y qué eliminar para aprovechar mejor tu tiempo y evitar el estrés académico.',
      image: 'pomodoro-preview.png',
    },
  ];

  advantageAlumnItems: AdvantageItem[] = [
    {
      title: 'Aprende a tu ritmo',
      description:
        'Accede a cursos diseñados por profesores y expertos, disponibles en todo momento. Ya sea desde tu ordenador, tablet o móvil, tú eliges cuándo y dónde estudiar. Acomoda tu aprendizaje a tu estilo de vida y avanza a tu propio ritmo sin presión.',
      image: 'cursos-alumno.png',
    },
    {
      title: 'Organiza tus tareas fácilmente',
      description:
        'Visualiza todas tus tareas, fechas de entrega y actividades en una interfaz clara y accesible. Recibe alertas automáticas, marca tareas como completadas y controla tu progreso día a día. Simplifica tu vida académica y mantén todo bajo control sin estrés.',
      image: 'tareas-alumnos.png',
    },
    {
      title: 'Calendario académico integrado',
      description:
        'Consulta tu calendario personalizado para no perderte clases, entregas o eventos. Todo sincronizado con tus cursos y actualizado en tiempo real. Planifica mejor tu semana, equilibra estudio y descanso, y mejora tu rendimiento académico.',
      image: 'calendario-preview.png',
    },
    {
      title: 'Participa en la comunidad',
      description:
        'Resuelve dudas, comparte ideas, colabora con otros estudiantes y recibe ayuda directa de tus profesores. Los foros temáticos y el chat en tiempo real te permiten mantenerte conectado, aprender de otros y crecer junto a una comunidad comprometida.',
      image: 'foro-profesor.png',
    },
    {
      title: 'Descarga y comparte tus cursos',
      description:
        'Guarda tus cursos en formato PDF para revisarlos sin conexión cuando lo necesites. Comparte fácilmente con tus compañeros o imprímelos para tenerlo en cualquier lugar.',
      image: 'pdf-curso.png',
    },
    {
      title: 'Organiza tu estudio con la matriz de Eisenhower',
      description:
        'Aprende a priorizar tus tareas según su urgencia e importancia. Esta metodología te permite planificar mejor tus sesiones de estudio, reducir el estrés y enfocarte en lo realmente importante.',
      image: 'pomodoro-preview.png',
    },
  ];

  currentType: AdvantageType = 'alumn';
  currentIndex = 0;

  @ViewChild('toggleBall', { static: false }) toggleBall!: ElementRef<HTMLSpanElement>;
  @ViewChild('containerDiv', { static: false }) containerDiv!: ElementRef<HTMLDivElement>;

  private ballTimeline?: gsap.core.Timeline;

  ngAfterViewInit() {
    this.animateBall();
    this.animateSwitch();
  }

  get currentArray(): AdvantageItem[] {
    return this.currentType === 'teacher' ? this.advantageTeacherItems : this.advantageAlumnItems;
  }

  get selectedItem(): AdvantageItem {
    return this.currentArray[this.currentIndex];
  }

  get isMobile(): boolean {
    return window.innerWidth <= 768;
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
    this.currentIndex =
      (this.currentIndex - 1 + this.currentArray.length) % this.currentArray.length;
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

  animateSwitch() {
    if (!this.containerDiv) return;

    const mm = gsap.matchMedia();

    mm.add('(max-width: 768px)', () => {
      const el = this.containerDiv.nativeElement;

      gsap.set(el, { opacity: 0, y: 30 });

      gsap.to(el, {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 40%',
          scrub: true,
          toggleActions: 'play reverse play reverse',
          markers: false,
        },
      });
    });

    mm.add('(min-width: 769px)', () => {
      const el = this.containerDiv.nativeElement;

      gsap.set(el, { opacity: 0, y: 50 });

      gsap.to(el, {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 40%',
          scrub: true,
          toggleActions: 'play reverse play reverse',
          markers: false,
        },
      });
    });
  }
}
