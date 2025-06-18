export interface ICourse {
  uuid: string;
  title: string;
  description: string;
  course_image_url: string;
  teacher: string;
  students: IStudent[];
  planning: IUnitCourse[];
}

export interface IUnitCourse {
  title: string;
  sections: {
    title: string;
  }[];
}

export interface IStudent {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  profile_image_url: string;
}
