export interface Itask {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  projectId: number;
  dueDate?: Date;
  subtasks: Isubtask[];
}

export interface Isubtask {
  id: number;
  name: string;
  completed: boolean;
  taskId: number;
}
