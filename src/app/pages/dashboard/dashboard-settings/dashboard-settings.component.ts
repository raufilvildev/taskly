import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { UsersService } from "../../../services/users.service";
import { AuthorizationService } from "../../../services/authorization.service";
import { Router } from "@angular/router";
import { IUser } from "../../../interfaces/iuser.interface";
import { constants } from "../../../shared/utils/constants/constants.config";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-dashboard-settings',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.css'],
})
export class DashboardSettingsComponent implements OnInit, OnDestroy {
  private usersService = inject(UsersService);
  private authorizationService = inject(AuthorizationService);
  private router = inject(Router);

  serverError = '';
  serverSuccess = '';

  receiveNotificationsControl = new FormControl<boolean>(false);


  private subscriptions = new Subscription();

  userSettingsForm = new FormGroup({
    first_name: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
    last_name: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
    birth_date: new FormControl(''),
    username: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
  });

    getValidationStyleClasses(control_name: string, errors: string[]) {
    if (
      ![
        'first_name',
        'last_name',
        'birth_date',
        'username',
      ].includes(control_name) ||
      errors.some(
        (error) =>
          !['minlength', 'maxlength'].includes(
            error
          )
      )
    ) {
      return {};
    }
    let hasErrors: boolean = false;

    if (this.userSettingsForm.get(control_name)?.touched) {
      hasErrors = errors.some((error) => this.userSettingsForm.get(control_name)?.hasError(error));
    }

    const isValid = this.userSettingsForm.get(control_name)?.valid && !hasErrors;

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
        this.userSettingsForm.get(control_name)?.touched &&
        this.userSettingsForm.get(control_name)?.hasError(error)
      ) {
        errors.push(`El campo ${constants.fields[control_name]} ${constants.messages[error]}.`);
      }
    }

    return errors;
  }


  ngOnInit(): void {
    this.loadUserSettings();

    this.subscriptions.add(
      this.receiveNotificationsControl.valueChanges.subscribe((value) => {
        this.saveNotificationPreference(value ?? false);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  

  async loadUserSettings(): Promise<void> {
    try {
      const user = await this.usersService.getUserSettings();

      const birthDateFormatted = user.birth_date
        ? typeof user.birth_date === 'string'
          ? user.birth_date.split('T')[0]
          : user.birth_date instanceof Date
          ? user.birth_date.toISOString().split('T')[0]
          : ''
        : '';

      
      this.userSettingsForm.patchValue({
        first_name: user.first_name,
        last_name: user.last_name,
        birth_date: birthDateFormatted,
        username: user.username,
      });

      if (user.notify_by_email !== undefined && user.notify_by_email !== null) {
        this.receiveNotificationsControl.setValue(!!user.notify_by_email, {
          emitEvent: false,
        });
      }

      this.showSuccess('Datos del perfil cargados correctamente.');
    } catch (error) {
      this.handleError(error, 'Error al cargar los ajustes del usuario.');
    }
  }

  async saveNotificationPreference(enabled: boolean): Promise<void> {
    try {
      await this.usersService.saveNotificationPreference(enabled);
      this.showSuccess('Preferencia de notificaciones guardada correctamente.');
    } catch (error) {
      this.handleError(error, 'Error al guardar preferencia de notificaciones.');
    }
  }

  async saveSettings(): Promise<void> {
    this.clearMessages();

    if (this.userSettingsForm.invalid) {
      this.userSettingsForm.markAllAsTouched();
      this.serverError = 'Por favor, corrige los errores en el formulario antes de guardar.';
      return;
    }

    const formValue = this.userSettingsForm.value;

    const updatedData: Partial<IUser> = {
      first_name: formValue.first_name || undefined,
      last_name: formValue.last_name || undefined,
      birth_date: formValue.birth_date || undefined,
      username: formValue.username || undefined,
    };

    try {
      await this.usersService.updateUserSettings(updatedData);
      this.showSuccess('Datos del perfil actualizados correctamente.');
    } catch (error) {
      this.handleError(error, 'Error al actualizar datos del perfil.');
    }
  }

  async deleteAccount(): Promise<void> {
    const confirmed = confirm('¿Estás seguro de que quieres borrar tu cuenta? Esta acción es irreversible.');

    if (!confirmed) return;

    this.clearMessages();

    try {
      const token = this.authorizationService.getToken();
      if (!token) throw new Error('No se encontró el token de autenticación para eliminar la cuenta.');

      await this.usersService.remove(token);
      alert('¡Tu cuenta ha sido eliminada con éxito!');
      this.authorizationService.removeToken();
      this.router.navigate(['/login']);
    } catch (error) {
      this.handleError(error, 'Error al borrar la cuenta.');
    }
  }

  private clearMessages() {
    this.serverError = '';
    this.serverSuccess = '';
  }

  private showSuccess(message: string) {
    this.serverSuccess = message;
    setTimeout(() => (this.serverSuccess = ''), constants.displayMessageTime || 3000);
  }

  private handleError(error: unknown, fallbackMessage: string) {
    if (error instanceof HttpErrorResponse) {
      this.serverError = error.error?.message || fallbackMessage;

      if (error.status === 401 || error.status === 403) {
        this.authorizationService.removeToken();
        this.router.navigate(['/login']);
      }
    } else {
      this.serverError = fallbackMessage;
    }
  }
  navigateToChangePassword(): void {
  this.router.navigate(['/login/change_password']);
}
}

