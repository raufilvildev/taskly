export interface IUser {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: Date | string;
  username: string;
  password?: string;
  email_confirmed?: number;
  role: 'general' | 'student' | 'teacher';
}
