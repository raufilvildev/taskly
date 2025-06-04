import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const password_confirmation = control.get('password_confirmation')?.value;

  return password === password_confirmation ? null : { passwordMismatch: true };
};
