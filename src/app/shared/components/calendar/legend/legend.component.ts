import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Priority {
  name: string;
  colorClass: string;
}

@Component({
  selector: 'app-calendar-legend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class CalendarLegendComponent {
  priorities: Priority[] = [
    { name: 'Alta', colorClass: 'bg-red-500' },
    { name: 'Media', colorClass: 'bg-yellow-500' },
    { name: 'Baja', colorClass: 'bg-green-500' },
    { name: 'Normal', colorClass: 'bg-blue-500' },
    { name: 'Sin prioridad', colorClass: 'bg-gray-500' }
  ];
}
