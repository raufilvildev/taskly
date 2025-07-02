import {
  Component,
  signal,
  ChangeDetectorRef,
  OnInit,
  inject,
  Input,
  computed,
  effect,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { TasksService } from '../../../../services/tasks.service';
import { CalendarLegendComponent } from '../legend/legend.component';
import { ITask } from '../../../../interfaces/itask';

interface TaskFilters {
  isUrgent: boolean;
  isImportant: boolean;
}

@Component({
  selector: 'app-calendar-table',
  imports: [CommonModule, FullCalendarModule, CalendarLegendComponent],
  templateUrl: './calendar-table.component.html',
  styleUrl: './calendar-table.component.css',
  standalone: true,
})
export class TableComponent implements OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly tasksService = inject(TasksService);

  @Input() course_uuid = '';

  currentEvents = signal<EventApi[]>([]);
  calendarOptions: CalendarOptions;

  activeFilters = signal<TaskFilters>({
    isUrgent: true,
    isImportant: true,
  });

  filteredTasks = computed(() => {
    const tasks = this.tasksService.tasks();
    const filters = this.activeFilters();

    return tasks.filter(
      (task) => (filters.isUrgent && task.is_urgent) || (filters.isImportant && task.is_important)
    );
  });

  constructor() {
    this.calendarOptions = this.getCalendarOptions();
    effect(() => {
      this.loadTasks();
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  private getCalendarOptions(): CalendarOptions {
    const isMobile = window.innerWidth < 768;

    return {
      plugins: [dayGridPlugin, timeGridPlugin],
      locale: esLocale,
      initialView: isMobile ? 'timeGridDay' : 'dayGridMonth',
      headerToolbar: {
        left: isMobile ? 'prev,next' : 'prev,next today',
        center: 'title',
        right: isMobile ? 'dayGridMonth,timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      buttonText: {
        today: isMobile ? 'Hoy' : 'Hoy',
        month: isMobile ? 'M' : 'Mes',
        week: isMobile ? 'S' : 'Semana',
        day: isMobile ? 'D' : 'Día',
      },
      views: {
        dayGridMonth: {
          titleFormat: { year: 'numeric', month: 'short' },
          dayHeaderFormat: isMobile ? { weekday: 'narrow' } : { weekday: 'long' },
          displayEventTime: false,
          fixedWeekCount: false,
        },
        timeGridWeek: {
          titleFormat: isMobile
            ? { month: 'short', day: 'numeric' }
            : { year: 'numeric', month: 'long', day: 'numeric' },
          dayHeaderFormat: isMobile
            ? { weekday: 'narrow', day: 'numeric' }
            : { weekday: 'short', day: 'numeric' },
          slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            meridiem: false,
          },
          slotMinTime: '07:00:00',
          slotMaxTime: '22:00:00',
          slotDuration: '00:30:00',
          scrollTime: '08:00:00',
        },
        timeGridDay: {
          titleFormat: isMobile
            ? { weekday: 'short', day: 'numeric' }
            : { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
          slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            meridiem: false,
          },
          slotMinTime: '07:00:00',
          slotMaxTime: '22:00:00',
          slotDuration: '00:30:00',
          scrollTime: '08:00:00',
        },
      },
      eventDisplay: 'block',
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        meridiem: false,
      },
      eventsSet: this.handleEvents.bind(this),
      eventClick: this.handleEventClick.bind(this),
      allDaySlot: true,
      allDayText: isMobile ? 'Todo día' : 'Todo el día',
      height: 'auto',
      expandRows: true,
      nowIndicator: true,
      handleWindowResize: true,
      windowResizeDelay: 200,
      stickyHeaderDates: true,
      dayMaxEvents: true,
      showNonCurrentDates: false,
      firstDay: 1, // Lunes como primer día de la semana
      weekNumbers: !isMobile, // Ocultar números de semana en móvil
      weekText: 'S',
      weekNumberFormat: { week: 'numeric' },
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5], // Lunes a Viernes
        startTime: '08:00',
        endTime: '20:00',
      },
    };
  }

  @HostListener('window:resize')
  onResize() {
    this.calendarOptions = this.getCalendarOptions();
  }

  private loadTasks(): void {
    const tasks = this.filteredTasks();
    const events = tasks.map((task) => ({
      id: task.uuid,
      title: task.title,
      date: task.due_date,
      allDay: true,
      backgroundColor: this.getPriorityColor(task),
      borderColor: this.getPriorityColor(task),
      textColor: '#ffffff',
      extendedProps: {
        description: task.description,
        isCompleted: task.is_completed,
        category: task.category,
        isUrgent: task.is_urgent,
        isImportant: task.is_important,
      },
    }));

    this.calendarOptions = {
      ...this.calendarOptions,
      events: events,
    };
  }

  private getPriorityColor(task: ITask): string {
    if (task.is_urgent && task.is_important) return '#ef4444';
    if (!task.is_urgent && task.is_important) return '#eab308';
    if (task.is_urgent && !task.is_important) return '#3b82f6';
    return '#22c55e';
  }

  private handleEvents(events: EventApi[]): void {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  private handleEventClick(info: any): void {
    const eventId = info.event.id;
    const tasks = this.tasksService.tasks();
    const selectedTask = tasks.find((task) => task.uuid === eventId);

    if (selectedTask) {
      this.tasksService.setSelectedTask(selectedTask);
    }
  }

  onFiltersChanged(filters: TaskFilters) {
    this.activeFilters.set(filters);
  }
}
