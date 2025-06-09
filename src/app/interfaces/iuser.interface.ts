export interface IUser {
  uuid?: string;
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: Date | string;
  username: string;
  password?: string;
  img_url?: string;
  email_confirmed?: number;
  role: 'general' | 'student' | 'teacher';
  notify_by_email?: number;
}
