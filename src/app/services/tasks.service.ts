import { Injectable, signal } from '@angular/core';
import { ITask } from '../interfaces/itask.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<ITask[]>(url);
  }

  // GET api/tasks/:course_uuid?filter=today|week|month -> getTasksByCourseUuid (si filter=today, mostrar también tareas pasadas no completadas)
  getTasksByCourseUuid(
    courseUuid: string,
    period: 'today' | 'week' | 'month'
  ): Observable<ITask[]> {
    const url = `${this.API_BASE_URL}/${courseUuid}?filter=${period}`;
    return this.http.get<ITask[]>(url);
  }

  // POST api/tasks -> Se asigna al usuario.
  createTask(taskData: Partial<ITask>): Observable<ITask> {
    const url = `${this.API_BASE_URL}`;
    return this.http.post<ITask>(url, taskData);
  }

  // POST api/tasks/?course_uuid -> Solo la puede hacer el profesor y se debe asignar tanto al profesor como a sus alumnos.
  createTaskForCourse(courseUuid: string, taskData: Partial<ITask>): Observable<ITask> {
    const url = `${this.API_BASE_URL}?course_uuid=${courseUuid}`;
    return this.http.post<ITask>(url, taskData);
  }

  // UPDATE api/tasks/:task_uuid -> Actualiza una tarea completa
  updateTask(taskUuid: string, taskData: Partial<ITask>): Observable<ITask> {
    const url = `${this.API_BASE_URL}/${taskUuid}`;
    return this.http.put<ITask>(url, taskData);
  }

  // PATCH api/tasks/:task_uuid -> Actualiza urgencia e importancia de la tarea
  updateTaskPropertiesByUuid(
    taskUuid: string,
    properties: { is_urgent?: boolean; is_important?: boolean }
  ): Observable<ITask> {
    const url = `${this.API_BASE_URL}/${taskUuid}`;
    return this.http.patch<ITask>(url, properties);
  }

  // DELETE api/tasks/:task_uuid
  deleteTask(taskUuid: string): Observable<void> {
    const url = `${this.API_BASE_URL}/${taskUuid}`;
    return this.http.delete<void>(url);
  }
}
