import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-create-edit-cancel-remove-button',
  imports: [MatIcon],
  templateUrl: './create-edit-cancel-remove-button.component.html',
  styleUrl: './create-edit-cancel-remove-button.component.css',
})
export class CreateEditCancelRemoveButtonComponent {
  @Input() type: 'create' | 'edit' | 'cancel' | 'remove' = 'create';
  @Input() icon: '_light' | '' = '';
}
