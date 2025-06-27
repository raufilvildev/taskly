import { Injectable, signal } from '@angular/core';
import { ITask } from '../interfaces/itask';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  public tasks = signal<ITask[]>([
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
        {
          id: 1,
          uuid: 'sub-1',
          task_id: 1,
          title: 'Create src folder',
          is_completed: true,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
        {
          id: 2,
          uuid: 'sub-2',
          task_id: 1,
          title: 'Setup package.json',
          is_completed: true,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
        {
          id: 3,
          uuid: 'sub-3',
          task_id: 1,
          title: 'Configure TypeScript',
          is_completed: false,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
        {
          id: 4,
          uuid: 'sub-4',
          task_id: 1,
          title: 'Setup build scripts',
          is_completed: false,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
      ],
    },
    {
      id: 2,
      uuid: 'uuid-2',
      user_id: 1,
      course_id: undefined,
      category: 'custom',
      title: 'Design database schema',
      description: 'Define tables, relationships and constraints for the database',
      due_date: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        return d.toISOString().slice(0, 10);
      })(),
      time_start: '',
      time_end: '',
      is_urgent: false,
      is_important: false,
      priority_color: 'yellow',
      is_completed: true,
      created_at: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        return d.toISOString().slice(0, 10);
      })(),
      updated_at: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        return d.toISOString().slice(0, 10);
      })(),
      subtasks: [
        {
          id: 5,
          uuid: 'sub-5',
          task_id: 2,
          title: 'Design user table',
          is_completed: true,
          created_at: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 2);
            return d.toISOString().slice(0, 10);
          })(),
          updated_at: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 2);
            return d.toISOString().slice(0, 10);
          })(),
        },
        {
          id: 6,
          uuid: 'sub-6',
          task_id: 2,
          title: 'Design product table',
          is_completed: true,
          created_at: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 2);
            return d.toISOString().slice(0, 10);
          })(),
          updated_at: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 2);
            return d.toISOString().slice(0, 10);
          })(),
        },
        {
          id: 7,
          uuid: 'sub-7',
          task_id: 2,
          title: 'Create relationships',
          is_completed: true,
          created_at: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 2);
            return d.toISOString().slice(0, 10);
          })(),
          updated_at: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 2);
            return d.toISOString().slice(0, 10);
          })(),
        },
      ],
    },
    {
      id: 3,
      uuid: 'uuid-3',
      user_id: 1,
      course_id: undefined,
      category: 'custom',
      title: 'Implement authentication',
      description: 'Add user login and registration functionality',
      due_date: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 6);
        return d.toISOString().slice(0, 10);
      })(),
      time_start: '',
      time_end: '',
      is_urgent: false,
      is_important: false,
      priority_color: 'red',
      is_completed: false,
      created_at: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 6);
        return d.toISOString().slice(0, 10);
      })(),
      updated_at: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 6);
        return d.toISOString().slice(0, 10);
      })(),
      subtasks: [
        {
          id: 8,
          uuid: 'sub-8',
          task_id: 3,
          title: 'Setup JWT tokens',
          is_completed: false,
          created_at: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 6);
            return d.toISOString().slice(0, 10);
          })(),
          updated_at: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 6);
            return d.toISOString().slice(0, 10);
          })(),
        },
        {
          id: 9,
          uuid: 'sub-9',
          task_id: 3,
          title: 'Create login form',
          is_completed: false,
          created_at: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 6);
            return d.toISOString().slice(0, 10);
          })(),
          updated_at: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 6);
            return d.toISOString().slice(0, 10);
          })(),
        },
        {
          id: 10,
          uuid: 'sub-10',
          task_id: 3,
          title: 'Add password validation',
          is_completed: false,
          created_at: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 6);
            return d.toISOString().slice(0, 10);
          })(),
          updated_at: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 6);
            return d.toISOString().slice(0, 10);
          })(),
        },
      ],
    },
    {
      id: 4,
      uuid: 'uuid-4',
      user_id: 1,
      course_id: undefined,
      category: 'custom',
      title: 'Revisar correos importantes',
      description: 'Leer y responder los correos urgentes del día',
      due_date: new Date().toISOString().slice(0, 10),
      time_start: '',
      time_end: '',
      is_urgent: true,
      is_important: true,
      priority_color: 'red',
      is_completed: false,
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
      subtasks: [
        {
          id: 11,
          uuid: 'sub-11',
          task_id: 4,
          title: 'Leer correos',
          is_completed: false,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
        {
          id: 12,
          uuid: 'sub-12',
          task_id: 4,
          title: 'Responder correos',
          is_completed: false,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
      ],
    },
    {
      id: 5,
      uuid: 'uuid-5',
      user_id: 1,
      course_id: undefined,
      category: 'custom',
      title: 'Preparar presentación semanal',
      description: 'Crear diapositivas y repasar los puntos clave para la reunión',
      due_date: new Date().toISOString().slice(0, 10),
      time_start: '',
      time_end: '',
      is_urgent: false,
      is_important: true,
      priority_color: 'yellow',
      is_completed: false,
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
      subtasks: [
        {
          id: 13,
          uuid: 'sub-13',
          task_id: 5,
          title: 'Crear diapositivas',
          is_completed: false,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
        {
          id: 14,
          uuid: 'sub-14',
          task_id: 5,
          title: 'Revisar contenido',
          is_completed: false,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
      ],
    },
    {
      id: 6,
      uuid: 'uuid-6',
      user_id: 1,
      course_id: undefined,
      category: 'custom',
      title: 'Actualizar documentación del proyecto',
      description: 'Agregar los cambios recientes al README y documentación técnica',
      due_date: new Date().toISOString().slice(0, 10),
      time_start: '',
      time_end: '',
      is_urgent: false,
      is_important: false,
      priority_color: 'neutral',
      is_completed: false,
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
      subtasks: [
        {
          id: 15,
          uuid: 'sub-15',
          task_id: 6,
          title: 'Actualizar README',
          is_completed: false,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
        {
          id: 16,
          uuid: 'sub-16',
          task_id: 6,
          title: 'Actualizar documentación técnica',
          is_completed: false,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
      ],
    },
    {
      id: 7,
      uuid: 'uuid-7',
      user_id: 1,
      course_id: undefined,
      category: 'custom',
      title: 'Realizar copia de seguridad',
      description: 'Hacer backup de los archivos importantes del proyecto',
      due_date: new Date().toISOString().slice(0, 10),
      time_start: '',
      time_end: '',
      is_urgent: false,
      is_important: true,
      priority_color: 'yellow',
      is_completed: false,
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
      subtasks: [
        {
          id: 17,
          uuid: 'sub-17',
          task_id: 7,
          title: 'Seleccionar archivos',
          is_completed: false,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
        {
          id: 18,
          uuid: 'sub-18',
          task_id: 7,
          title: 'Subir a la nube',
          is_completed: false,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
      ],
    },
    {
      id: 8,
      uuid: 'uuid-8',
      user_id: 1,
      course_id: undefined,
      category: 'custom',
      title: 'Revisar tareas pendientes',
      description: 'Verificar el estado de las tareas y planificar el resto de la semana',
      due_date: new Date().toISOString().slice(0, 10),
      time_start: '',
      time_end: '',
      is_urgent: false,
      is_important: false,
      priority_color: 'neutral',
      is_completed: false,
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
      subtasks: [
        {
          id: 19,
          uuid: 'sub-19',
          task_id: 8,
          title: 'Revisar lista de tareas',
          is_completed: false,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
        {
          id: 20,
          uuid: 'sub-20',
          task_id: 8,
          title: 'Planificar semana',
          is_completed: false,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        },
      ],
    },
  ]);

  selectedTask = signal<ITask | null>(null);

  setSelectedTask(task: ITask | null) {
    this.selectedTask.set(task);
  }
  updateTasks() {
    this.tasks.set([...this.tasks()]);
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
  // GET api/tasks/:course_uuid?filter=today|week|month -> getTasksByCourseUuid (si filter=today, mostrar también tareas pasadas no completadas)
  // GET api/tasks/courses?filter=today|week|month ->

  // POST api/tasks -> Se asigna al usuario.
  // POST api/tasks/?course_uuid -> Solo la puede hacer el profesor y se debe asignar tanto al profesor como a sus alumnos.

  // UPDATE api/tasks/:task_uuid -> Actualiza una tarea completa
  // PATCH api/tasks/:task_uuid -> Actualiza urgencia e importancia de la tarea

  // DELETE api/tasks/:task_uuid
}
