export interface IUser {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  username: string;
  password: string;
  profile_image_url: string;
  notify_by_email: number;
  email_confirmed: number;
  role: 'general' | 'student' | 'teacher';
  created_at: string;
  updated_at: string;
}

export interface ISignupUser {
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  username: string;
  password: string;
  role: 'general' | 'student' | 'teacher';
}

export interface IGetByTokenUser {
  uuid: string;
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  username: string;
  profile_image_url: string;
  notify_by_email: number;
  email_confirmed: number;
  role: 'general' | 'student' | 'teacher';
}
