export interface ICourse {
  uuid: string;
  title: string;
  description: string;
  course_image_url: string;
  teacher: string;
  planning: IUnitCourse[];
}

export interface IUnitCourse {
  id: number;
  title: string;
  sections: {
    id: number;
    title: string;
  }[];
}
