import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { TasksService } from '../../../../../services/tasks.service';


@Component({
  selector: 'app-dashboard-home-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './dashboard-home-calendar.component.html',
  styleUrl: './dashboard-home-calendar.component.css'
})
export class DashboardHomeCalendarComponent implements OnInit {
  private readonly tasksService = inject(TasksService);

  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    height: '100%',
    headerToolbar: false,
    dayHeaderFormat: { weekday: 'narrow' }, // L M X J V S D
    events: [], 
    eventDisplay: 'custom',
  });

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    const tasks = this.tasksService.tasks();
    const events = tasks.map(task => ({
      id: task.uuid,
      title: task.title,
      date: task.due_date,
      allDay: true,
      backgroundColor: this.getPriorityColor(task.priority_color),
    }));

    this.calendarOptions.update(opt => ({ ...opt, events }));
  }

  private getPriorityColor(priority: string): string {
    switch (priority) {
      case 'red': return '#ef4444';
      case 'yellow': return '#eab308';
      case 'green': return '#22c55e';
      case 'blue': return '#3b82f6';
      default: return '#6b7280';
    }
  }
}

