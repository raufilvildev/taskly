import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment',
  imports: [UpperCasePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent {
  @Input() comment?: {
    user: { name: string; img_url: string };
    created_at: string;
    updated_at: string;
    content: string;
  };
}
