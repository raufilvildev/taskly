import { Component, Input, OnChanges, OnInit, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { TasksService } from '../../../../../services/tasks.service';
import { ITask } from '../../../../../interfaces/itask.interface';


@Component({
  selector: 'app-dashboard-home-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './dashboard-home-calendar.component.html',
  styleUrl: './dashboard-home-calendar.component.css'
})
export class DashboardHomeCalendarComponent implements OnInit, OnChanges {
  private readonly tasksService = inject(TasksService);

  @Input() tasks: ITask[] = [];
  @Input() getPriorityColorFn!: (task: ITask) => string;


  calendarOptions = signal<CalendarOptions>({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  locale: esLocale,
  height: '100%',
  headerToolbar: false,
  dayHeaderFormat: { weekday: 'narrow' },
  events: [], 
  eventDisplay: 'custom',
  });

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks'] && this.tasks?.length) {
      this.loadEvents();
    }
  }

  private loadEvents(): void {
  const events = this.tasks.map(task => ({
    id: task.uuid,
    title: task.title,
    date: task.due_date,
    allDay: true,
    extendedProps: { task }, 
  }));

  this.calendarOptions.update(opt => ({ ...opt, events }));
}

}