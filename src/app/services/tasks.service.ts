import { Injectable, signal } from '@angular/core';
import { ITask } from '../interfaces/itask';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  public projects = signal<ITask[]>([
    {
      id: 1,
      uuid: 'uuid-1',
      user_id: 1,
      course_id: undefined,
      category: 'course_related',
      title: 'Setup project structure',
      description: 'Create initial folder structure and configuration files',
      due_date: new Date().toISOString().slice(0, 10), // hoy
      time_start: '',
      time_end: '',
      is_urgent: false,
      is_important: false,
      priority_color: 'neutral',
      is_completed: false,
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
      subtasks: [
        { id: 1, uuid: 'sub-1', task_id: 1, title: 'Create src folder', is_completed: true, created_at: new Date().toISOString().slice(0, 10), updated_at: new Date().toISOString().slice(0, 10) },
        { id: 2, uuid: 'sub-2', task_id: 1, title: 'Setup package.json', is_completed: true, created_at: new Date().toISOString().slice(0, 10), updated_at: new Date().toISOString().slice(0, 10) },
        { id: 3, uuid: 'sub-3', task_id: 1, title: 'Configure TypeScript', is_completed: false, created_at: new Date().toISOString().slice(0, 10), updated_at: new Date().toISOString().slice(0, 10) },
        { id: 4, uuid: 'sub-4', task_id: 1, title: 'Setup build scripts', is_completed: false, created_at: new Date().toISOString().slice(0, 10), updated_at: new Date().toISOString().slice(0, 10) }
      ]
    },
    {
      id: 2,
      uuid: 'uuid-2',
      user_id: 1,
      course_id: undefined,
      category: 'custom',
      title: 'Design database schema',
      description: 'Define tables, relationships and constraints for the database',
      due_date: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); })(),
      time_start: '',
      time_end: '',
      is_urgent: false,
      is_important: false,
      priority_color: 'yellow',
      is_completed: true,
      created_at: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); })(),
      updated_at: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); })(),
      subtasks: [
        { id: 5, uuid: 'sub-5', task_id: 2, title: 'Design user table', is_completed: true, created_at: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); })(), updated_at: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); })() },
        { id: 6, uuid: 'sub-6', task_id: 2, title: 'Design product table', is_completed: true, created_at: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); })(), updated_at: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); })() },
        { id: 7, uuid: 'sub-7', task_id: 2, title: 'Create relationships', is_completed: true, created_at: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); })(), updated_at: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); })() }
      ]
    },
    {
      id: 3,
      uuid: 'uuid-3',
      user_id: 1,
      course_id: undefined,
      category: 'custom',
      title: 'Implement authentication',
      description: 'Add user login and registration functionality',
      due_date: (() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().slice(0, 10); })(),
      time_start: '',
      time_end: '',
      is_urgent: false,
      is_important: false,
      priority_color: 'red',
      is_completed: false,
      created_at: (() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().slice(0, 10); })(),
      updated_at: (() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().slice(0, 10); })(),
      subtasks: [
        { id: 8, uuid: 'sub-8', task_id: 3, title: 'Setup JWT tokens', is_completed: false, created_at: (() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().slice(0, 10); })(), updated_at: (() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().slice(0, 10); })() },
        { id: 9, uuid: 'sub-9', task_id: 3, title: 'Create login form', is_completed: false, created_at: (() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().slice(0, 10); })(), updated_at: (() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().slice(0, 10); })() },
        { id: 10, uuid: 'sub-10', task_id: 3, title: 'Add password validation', is_completed: false, created_at: (() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().slice(0, 10); })(), updated_at: (() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().slice(0, 10); })() }
      ]
    }
  ]);

  selectedTask = signal<ITask | null>(null);

  setSelectedTask(task: ITask) {
    this.selectedTask.set(task);
  }
  updateTasks() {
    this.projects.set([...this.projects()]);
  }
}
