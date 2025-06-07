import { Injectable, signal } from '@angular/core';
import { Itask } from '../interfaces/itask';
import { Ilist } from '../interfaces/ilist';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public projects = signal<Ilist[]>([
    {
      id: 1,
      name: 'Project Alpha',
      tasks: [
        { 
          id: 1, 
          title: 'Setup project structure', 
          description: 'Create initial folder structure and configuration files', 
          completed: false, 
          projectId: 1, 
          dueDate: new Date('2024-01-15'),
          subtasks: [
            { id: 1, name: 'Create src folder', completed: true, taskId: 1 },
            { id: 2, name: 'Setup package.json', completed: true, taskId: 1 },
            { id: 3, name: 'Configure TypeScript', completed: false, taskId: 1 },
            { id: 4, name: 'Setup build scripts', completed: false, taskId: 1 }
          ]
        },
        { 
          id: 2, 
          title: 'Design database schema', 
          description: 'Define tables, relationships and constraints for the database', 
          completed: true, 
          projectId: 1, 
          dueDate: new Date('2024-01-10'),
          subtasks: [
            { id: 5, name: 'Design user table', completed: true, taskId: 2 },
            { id: 6, name: 'Design product table', completed: true, taskId: 2 },
            { id: 7, name: 'Create relationships', completed: true, taskId: 2 }
          ]
        },
        { 
          id: 3, 
          title: 'Implement authentication', 
          description: 'Add user login and registration functionality', 
          completed: false, 
          projectId: 1, 
          dueDate: new Date('2024-01-20'),
          subtasks: [
            { id: 8, name: 'Setup JWT tokens', completed: false, taskId: 3 },
            { id: 9, name: 'Create login form', completed: false, taskId: 3 },
            { id: 10, name: 'Add password validation', completed: false, taskId: 3 }
          ]
        },
      ]
    },
    {
      id: 2,
      name: 'Project Beta',
      tasks: [
        { 
          id: 4, 
          title: 'Create wireframes', 
          description: 'Design user interface mockups and user flow diagrams', 
          completed: false, 
          projectId: 2, 
          dueDate: new Date('2024-01-18'),
          subtasks: [
            { id: 11, name: 'Homepage wireframe', completed: true, taskId: 4 },
            { id: 12, name: 'Dashboard wireframe', completed: false, taskId: 4 },
            { id: 13, name: 'Mobile responsive design', completed: false, taskId: 4 }
          ]
        },
        { 
          id: 5, 
          title: 'Setup CI/CD pipeline', 
          description: 'Configure automated testing and deployment workflows', 
          completed: false, 
          projectId: 2, 
          dueDate: new Date('2024-01-25'),
          subtasks: [
            { id: 14, name: 'Configure GitHub Actions', completed: false, taskId: 5 },
            { id: 15, name: 'Setup testing pipeline', completed: false, taskId: 5 }
          ]
        },
      ]
    }
  ]);

  selectedProject = signal<Ilist | null>(null);
  selectedTask = signal<Itask | null>(null);

  setSelectedProject(project: Ilist) {
    this.selectedProject.set(project);
    this.selectedTask.set(null);
  }

  setSelectedTask(task: Itask) {
    this.selectedTask.set(task);
  }
}
