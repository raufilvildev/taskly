import { ICourse, IStudent, IUnitCourse } from '../../interfaces/icourse.interface';
import { IResponse } from '../../interfaces/iforum.interface';
import { IUser } from '../../interfaces/iuser.interface';

export const initUser = (): IUser => {
  return {
    id: 0,
    uuid: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    email: '',
    username: '',
    password: '',
    profile_image_url: 'default_user_profile.svg',
    notify_by_email: 1,
    email_confirmed: 0,
    role: 'general',
    created_at: '',
    updated_at: '',
  };
};

export const initCourse = (): ICourse => {
  return {
    uuid: '',
    title: '',
    description: '',
    course_image_url: '',
    teacher: '',
    students: [],
    planning: [],
  };
};

export const initUnit = (): IUnitCourse => {
  return {
    title: '',
    sections: [],
  };
};

export const initResponse = (): IResponse => {
  return {
    uuid: '',
    user: {
      uuid: '',
      first_name: '',
      last_name: '',
      profile_image_url: 'default_user_profile.svg',
      role: 'student',
    },
    content: '',
  };
};

export const initStudent = (): IStudent => {
  return {
    uuid: '',
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    profile_image_url: '',
  };
};
