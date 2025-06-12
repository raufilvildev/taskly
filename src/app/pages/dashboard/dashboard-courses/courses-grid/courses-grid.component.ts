import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICourse } from '../../../../interfaces/icourse.interface';
import { CoursesService } from '../../../../services/courses.service';
import { AuthorizationService } from '../../../../services/authorization.service';

@Component({
  selector: 'app-courses-grid',
  imports: [RouterLink],
  templateUrl: './courses-grid.component.html',
  styleUrl: './courses-grid.component.css',
})
export class CoursesGridComponent {
  authorizationService = inject(AuthorizationService);
  coursesService = inject(CoursesService);

  courses: ICourse[] = [];

  async ngOnInit() {
    try {
      const token: string = this.authorizationService.getToken();
      this.courses = await this.coursesService.getAll(token);
    } catch (error) {
      this.courses = [
        {
          uuid: 'f1e4a9b7-52cd-49f4-8317-a7d481c9f101',
          title: 'Introducción a Angular aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          description: 'Aprende los fundamentos del framework Angular.',
          course_image_url:
            'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/001.png',
          teacher: 'Laura Fernández',
        },
        {
          uuid: '9b2e2195-f163-4df7-b75a-caf36c1c6e41',
          title: 'Fundamentos de TypeScript',
          description: 'Curso esencial para dominar TypeScript desde cero.',
          course_image_url: 'https://source.unsplash.com/400x200/?typescript',
          teacher: 'Carlos Pérez aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        },
        {
          uuid: 'de27f1cb-0f2e-41ad-918b-5a364f0e02df',
          title: 'Diseño Web Moderno',
          description:
            'Explora técnicas de diseño web con CSS y Tailwind. sdgvasgas asgkasnghar asdfgpioasjmgas <SDGPSMNG',
          course_image_url: 'https://source.unsplash.com/400x200/?css',
          teacher: 'María López',
        },
        {
          uuid: 'c6721a87-9a34-4d12-a97d-fce2c5e3a1f3',
          title: 'Backend con Node.js',
          description: 'Construye APIs escalables con Express y Node.',
          course_image_url: 'https://source.unsplash.com/400x200/?nodejs',
          teacher: 'Javier Sánchez',
        },
        {
          uuid: '40db91b3-3e20-4f47-84a2-53e36d3d74f0',
          title: 'Bases de Datos con PostgreSQL',
          description: 'Gestiona datos relacionales de forma eficiente.',
          course_image_url: 'https://source.unsplash.com/400x200/?database',
          teacher: 'Ana Torres',
        },
      ];
      return;
    }
  }
}
