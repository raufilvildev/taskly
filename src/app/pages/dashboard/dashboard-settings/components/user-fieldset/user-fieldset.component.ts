import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormControlName, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-fieldset',
  templateUrl: './user-fieldset.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserFieldsetComponent {

  @Input() label!: string;
  @Input() controlName!: string;
  @Input() type: string = 'text';
  @Input() formGroup!: FormGroup;
  @Input() isEditing!: boolean;
  @Input() value!: string | Date;
  @Input() isDisabled: boolean = false;

  @Output() toggleEdit = new EventEmitter<string | null>();

  onToggleEdit() {
    this.toggleEdit.emit(this.controlName);
  }

  onCancelEdit() {
    this.toggleEdit.emit(null);
  }

  get control(): FormControl {
    const ctrl = this.formGroup?.get(this.controlName);
    return ctrl as FormControl;
  }

}
