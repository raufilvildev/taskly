import { Component, Input } from '@angular/core';
import { ResponseComponent } from '../response/response.component';

@Component({
  selector: 'app-thread',
  imports: [ResponseComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.css',
})
export class ThreadComponent {
  @Input() thread!: {
    uuid: string;
    user: { uuid: string; first_name: string; last_name: string; img_url: string; role: string };
    title: string;
    created_at: string;
    updated_at: string;
    content: string;
    responses: {
      uuid: string;
      user: { uuid: string; first_name: string; last_name: string; img_url: string; role: string };
      created_at: string;
      updated_at: string;
      content: string;
    }[];
  };

  uuid = '02';
}
