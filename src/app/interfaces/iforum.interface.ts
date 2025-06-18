export interface IForumUser {
  uuid: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  role: 'teacher' | 'student';
}

export interface IResponse {
  uuid?: string;
  user: IForumUser;
  created_at?: string;
  updated_at?: string;
  content: string;
}

export interface IThread {
  uuid?: string;
  user?: IForumUser;
  title: string;
  created_at?: string;
  updated_at?: string;
  content: string;
  responses: IResponse[];
}
