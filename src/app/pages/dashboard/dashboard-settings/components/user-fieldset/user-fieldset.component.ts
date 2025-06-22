import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormControlName, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { constants } from '../../../../../shared/utils/constants/constants.config';

@Component({
  selector: 'app-user-fieldset',
  templateUrl: './user-fieldset.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class UserFieldsetComponent {
  @Input() label!: string;
  @Input() controlName!: string;
  @Input() type: string = 'text';
  @Input() formGroup!: FormGroup;
  @Input() isEditing!: boolean;
  @Input() value!: string | Date;
  @Input() isDisabled: boolean = false;
  @Input() validation!: string[];

  @Output() toggleEdit = new EventEmitter<string | null>();
  @Output() saveEdit = new EventEmitter<{ controlName: string; value: string | Date }>();

  onToggleEdit() {
    this.toggleEdit.emit(this.controlName);
  }

  onCancelEdit() {
    this.toggleEdit.emit(null);
  }

  onSaveEdit(): void {
    const control = this.formGroup.get(this.controlName);

    if (!control) return;

    control.markAsTouched();

    if (control.valid) {
      this.saveEdit.emit({
        controlName: this.controlName,
        value: control.value,
      });

      this.toggleEdit.emit(null);
    }
  }

  get control(): FormControl {
    const ctrl = this.formGroup?.get(this.controlName);
    return ctrl as FormControl;
  }

  getValidationStyleClasses(control_name: string, errors: string[]) {
    if (
      !['first_name', 'last_name', 'birth_date', 'username'].includes(control_name) ||
      errors.some((error) => !['minlength', 'maxlength'].includes(error))
    ) {
      return {};
    }
    let hasErrors: boolean = false;

    if (this.formGroup.get(control_name)?.touched) {
      hasErrors = errors.some((error) => this.formGroup.get(control_name)?.hasError(error));
    }

    const isValid = this.formGroup.get(control_name)?.valid && !hasErrors;

    return {
      'border-custom-error': hasErrors,
      'bg-red-100': hasErrors,
      'hover:border-custom-error': hasErrors,
      'focus:outline-custom-error': hasErrors,
      'focus:shadow-custom-error': hasErrors,
      'border-custom-success': isValid,
      'hover:border-custom-success': isValid,
      'focus:outline-custom-success': isValid,
      'focus:shadow-custom-success': isValid,
    };
  }

  getErrors(control_name: string) {
    const errors: string[] = [];

    for (const error in constants.messages) {
      if (
        this.formGroup.get(control_name)?.touched &&
        this.formGroup.get(control_name)?.hasError(error)
      ) {
        errors.push(`El campo ${constants.fields[control_name]} ${constants.messages[error]}.`);
      }
    }

    return errors;
  }

  onEnterKey(event: any): void {
    event.preventDefault(); // Evita que el formulario o input actúe por defecto

    if (this.control.valid) {
      this.onSaveEdit(); // Solo si es válido
    } else {
      this.control.markAsTouched(); // Marca como tocado para que salten errores
    }
  }
}
