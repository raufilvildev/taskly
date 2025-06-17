import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-create-edit-cancel-remove-button',
  imports: [],
  templateUrl: './create-edit-cancel-remove-button.component.html',
  styleUrl: './create-edit-cancel-remove-button.component.css',
})
export class CreateEditCancelRemoveButtonComponent {
  @Input() type: 'create' | 'edit' | 'cancel' | 'remove' = 'create';
  @Input() icon: '_light' | '' = '';
}
