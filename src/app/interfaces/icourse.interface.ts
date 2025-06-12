export interface ICourse {
  uuid: string;
  title: string;
  description: string;
  planning?: IUnitCourse[];
  course_image_url: string;
  teacher: string;
}

export interface IUnitCourse {
  id: number;
  title: string;
  sections: {
    id: number;
    title: string;
  }[];
}
