import { Injectable, signal } from '@angular/core';
import { ITask } from '../interfaces/itask.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment.test';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly API_BASE_URL = `${environment.host}/api/tasks`;

  public tasks = signal<ITask[]>([]);
  selectedTask = signal<ITask | null>(null);

  constructor(private http: HttpClient) {}

  setSelectedTask(task: ITask | null) {
    this.selectedTask.set(task);
  }

  updateTaskProperties(
    taskId: number,
    properties: { is_urgent?: boolean; is_important?: boolean }
  ) {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, ...properties } : task))
    );
  }

  // GET api/tasks?filter=today|week|month -> getAll (si filter=today, mostrar también tareas pasadas no completadas)
  getTasksByPeriod(period: 'today' | 'week' | 'month'): Observable<ITask[]> {
    const url = `${this.API_BASE_URL}?filter=${period}`;
    return this.http.get<ITask[]>(url).pipe(
      tap((tasks) => this.tasks.set(tasks))
    );
  }

  // GET api/tasks/:course_uuid?filter=today|week|month -> getTasksByCourseUuid (si filter=today, mostrar también tareas pasadas no completadas)
  getTasksByCourseUuid(
    courseUuid: string,
    period?: 'today' | 'week' | 'month'
  ): Observable<ITask[]> {
    const url = period
      ? `${this.API_BASE_URL}/${courseUuid}?filter=${period}`
      : `${this.API_BASE_URL}/${courseUuid}`;
    return this.http.get<ITask[]>(url).pipe(
      tap((tasks) => this.tasks.set(tasks))
    );
  }

  // POST api/tasks -> Se asigna al usuario.
  createTask(taskData: Partial<ITask>): Observable<ITask> {
    const url = `${this.API_BASE_URL}`;
    return this.http.post<ITask>(url, taskData).pipe(
      tap((newTask) => {
        this.tasks.update(tasks => [...tasks, newTask]);
      })
    );
  }

  // POST api/tasks/:course_uuid -> Solo la puede hacer el profesor y se debe asignar tanto al profesor como a sus alumnos.
  createTaskByProf(courseUuid: string, taskData: Partial<ITask>): Observable<ITask> {
    const url = `${this.API_BASE_URL}/${courseUuid}`;
    return this.http.post<ITask>(url, taskData).pipe(
      tap((newTask) => {
        this.tasks.update(tasks => [...tasks, newTask]);
      })
    );
  }

  // UPDATE api/tasks/:task_uuid -> Actualiza una tarea completa
  updateTask(taskUuid: string, taskData: Partial<ITask>): Observable<ITask> {
    const url = `${this.API_BASE_URL}/${taskUuid}`;
    return this.http.put<ITask>(url, taskData).pipe(
      tap((updatedTask) => {
        this.tasks.update(tasks =>
          tasks.map(task => task.uuid === taskUuid ? updatedTask : task)
        );
      })
    );
  }

  // PATCH api/tasks/:task_uuid -> Actualiza urgencia e importancia de la tarea
  updateTaskPropertiesByUuid(
    taskUuid: string,
    properties: { is_urgent?: boolean; is_important?: boolean }
  ): Observable<ITask> {
    const url = `${this.API_BASE_URL}/${taskUuid}`;
    return this.http.patch<ITask>(url, properties).pipe(
      tap((updatedTask) => {
        this.tasks.update(tasks =>
          tasks.map(task => task.uuid === taskUuid ? updatedTask : task)
        );
      })
    );
  }

  // DELETE api/tasks/:task_uuid
  deleteTask(taskUuid: string): Observable<void> {
    const url = `${this.API_BASE_URL}/${taskUuid}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        this.tasks.update(tasks => tasks.filter(task => task.uuid !== taskUuid));
      })
    );
  }

  // GET api/tasks -> Obtiene todas las tareas sin filtros
  getAllTasks(): Observable<ITask[]> {
    const url = `${this.API_BASE_URL}`;
    return this.http.get<ITask[]>(url).pipe(
      tap((tasks) => this.tasks.set(tasks))
    );
  }
}
