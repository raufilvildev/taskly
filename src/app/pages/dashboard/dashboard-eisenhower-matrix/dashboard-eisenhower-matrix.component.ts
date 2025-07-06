import { Component, inject } from '@angular/core';
import { EisenhowerMatrixComponent } from "../../../shared/components/eisenhower-matrix/eisenhower-matrix.component";
import { TasksService } from '../../../services/tasks.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-eisenhower-matrix',
  standalone: true,
  imports: [CommonModule, EisenhowerMatrixComponent],
  templateUrl: './dashboard-eisenhower-matrix.component.html',
  styleUrl: './dashboard-eisenhower-matrix.component.css'
})
export class DashboardEisenhowerMatrixComponent {
  private tasksService = inject(TasksService);

  ngOnInit(): void {
    // Cargar todas las tareas
    this.tasksService.getAllTasks().subscribe(tasks => {
      this.tasksService.tasks.set(tasks);
    });
  }
}
