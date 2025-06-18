import { Component, signal, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { TasksService } from '../../../../services/tasks.service';

@Component({
  selector: 'app-calendar-table',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar-table.component.html',
  styleUrl: './calendar-table.component.css',
  standalone: true
})
export class TableComponent implements OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly tasksService = inject(TasksService);

  currentEvents = signal<EventApi[]>([]);

  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin],
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: false,
    selectable: false,
    dayMaxEvents: true,
    events: [],
    eventDisplay: 'block',
    eventColor: '#3b82f6',
    eventTextColor: '#ffffff',
    eventsSet: this.handleEvents.bind(this),
    eventClick: this.handleEventClick.bind(this),
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: true,
    slotDuration: '01:00:00',
    height: 'auto',
    expandRows: true,
    nowIndicator: true,
    dayHeaderFormat: { weekday: 'long' },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana'
    },
    views: {
      timeGridWeek: {
        dayHeaderFormat: { weekday: 'short', day: 'numeric' },
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }
      }
    }
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    const tasks = this.tasksService.tasks();
    const events = tasks.map(task => ({
      id: task.uuid,
      title: task.title,
      date: task.due_date,
      allDay: true,
      backgroundColor: this.getPriorityColor(task.priority_color),
      borderColor: this.getPriorityColor(task.priority_color),
      textColor: '#ffffff',
      extendedProps: {
        description: task.description,
        isCompleted: task.is_completed,
        category: task.category,
        priority: task.priority_color
      }
    }));

    this.calendarOptions.update(options => ({
      ...options,
      events: events
    }));
  }

  private getPriorityColor(priority: string): string {
    switch (priority) {
      case 'red':
        return '#ef4444';
      case 'yellow':
        return '#eab308';
      case 'green':
        return '#22c55e';
      case 'blue':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  }

  private handleEvents(events: EventApi[]): void {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  private handleEventClick(info: any): void {
    const eventId = info.event.id;
    const tasks = this.tasksService.tasks();
    const selectedTask = tasks.find(task => task.uuid === eventId);

    if (selectedTask) {
      this.tasksService.setSelectedTask(selectedTask);
    }
  }
}
