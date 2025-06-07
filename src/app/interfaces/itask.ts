import { Isubtask } from "./isubtask";

export interface Itask {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  projectId: number;
  dueDate?: Date;
  subtasks: Isubtask[];
}
