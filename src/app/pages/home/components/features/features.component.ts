import { AfterViewInit, Component, computed, ElementRef, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-features',
  imports: [],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css',
})
export class FeaturesComponent  {
  professorTags = [
  'Crea tus cursos',
  'Controla el progreso',
  'Sube tus recursos',
  'Gestiona tareas',
  'Habla con tu clase',
  'Organiza con calendario',
  'Descarga la planificación',
  'Prioriza con Eisenhower'
];

  studentTags = [
  'Aprende a tu ritmo',
  'Cursos a medida',
  'Material exclusivo',
  'Sigue tu progreso',
  'Participa en foros',
  'Planifica tu estudio',
  'Organiza tus tareas',
  'Enfócate con Pomodoro'
];

  @ViewChild('professorScroller', { static: true }) professorScroller!: ElementRef<HTMLDivElement>;
  @ViewChild('studentScroller', { static: true }) studentScroller!: ElementRef<HTMLDivElement>;
}