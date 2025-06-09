import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  FormsModule,
} from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import type { IUser } from '../../../interfaces/iuser.interface';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../services/authorization.service';
import { passwordsMatchValidator } from '../../../validators/passwords_match.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from '../../../shared/utils/constants/constants.config';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-settings',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './dashboard-settings.component.html',
  styleUrl: './dashboard-settings.component.css'
})
export class DashboardSettingsComponent {
  usersService = inject(UsersService);
  authorizationService = inject(AuthorizationService);
  router = inject(Router);

  serverError: string = '';
  serverSuccess: string = '';
  receiveNotificationsControl = new FormControl<boolean>(false);


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
    ])

  });
  private subscriptions = new Subscription();

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
          !['minlength', 'maxlength', 'pattern'].includes(
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

    // Se suscribe a los cambios en el control de notificaciones.
    // Cuando el usuario cambia la preferencia de notificaciones, se guarda automáticamente.
    this.subscriptions.add(
      this.receiveNotificationsControl.valueChanges.subscribe((value) => {
        this.saveNotificationPreference(value ?? false);
      })
    );
  }

  ngOnDestroy(): void {
    // Limpia la suscripción para evitar fugas de memoria.
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }


  async loadUserSettings(): Promise<void> {
    try {
      const user: IUser = await this.usersService.getUserSettings();

      // Manejo de 'birth_date': Se convierte el valor a formato 'YYYY-MM-DD'
      this.userSettingsForm.patchValue({
        first_name: user.first_name,
        last_name: user.last_name,
        birth_date: user.birth_date
          ? typeof user.birth_date === 'string'
            ? user.birth_date.split('T')[0] // 
            : user.birth_date instanceof Date
            ? user.birth_date.toISOString().split('T')[0]
            : null
          : null, 
        username: user.username,
      });

      // Establece el estado inicial del control de notificaciones.
      if (user.notify_by_email !== undefined && user.notify_by_email !== null) {
        this.receiveNotificationsControl.setValue(!!user.notify_by_email, {
          emitEvent: false,
        });
      }

      this.serverSuccess = 'Datos del perfil cargados correctamente.';
      
      setTimeout(() => (this.serverSuccess = ''), constants.displayMessageTime || 3000);
    } catch (error) {
      console.error('Error al cargar los ajustes del usuario:', error);
      if (error instanceof HttpErrorResponse) {
        this.serverError = error.error?.message || constants.generalServerError;
      } else {
        this.serverError = constants.generalServerError;
      }

      // Manejo de errores
      if (
        error instanceof HttpErrorResponse &&
        (error.status === 401 || error.status === 403)
      ) {
        this.authorizationService.removeToken();
        this.router.navigate(['/login']);
      }
    }
  }

 
  async saveNotificationPreference(enabled: boolean): Promise<void> {
    try {
      await this.usersService.saveNotificationPreference(enabled);
      this.serverSuccess = 'Preferencia de notificaciones guardada correctamente.';
      setTimeout(() => (this.serverSuccess = ''), constants.displayMessageTime || 3000);
    } catch (error) {
      console.error('Error al guardar preferencia de notificaciones:', error);
      if (error instanceof HttpErrorResponse) {
        this.serverError = error.error?.message || constants.generalServerError;
      } else {
        this.serverError = constants.generalServerError;
      }
    }
  }


  async saveSettings(): Promise<void> {
    this.serverError = '';
    this.serverSuccess = '';

    if (this.userSettingsForm.invalid) {
      this.userSettingsForm.markAllAsTouched();
      this.serverError = 'Por favor, corrige los errores en el formulario antes de guardar.';
      return;
    }

    const formValue = this.userSettingsForm.value;

    const updatedData: Partial<IUser> = {
      first_name: formValue.first_name ?? undefined,
      last_name: formValue.last_name ?? undefined,
      birth_date: formValue.birth_date ?? undefined,
      username: formValue.username ?? undefined,
  
    };

    try {
      await this.usersService.updateUserSettings(updatedData);
      this.serverSuccess = 'Datos del perfil actualizados correctamente.';
      setTimeout(() => (this.serverSuccess = ''), constants.displayMessageTime || 3000);
    } catch (error) {
      console.error('Error al actualizar datos del perfil:', error);
      if (error instanceof HttpErrorResponse) {
        this.serverError = error.error?.message || constants.generalServerError;
      } else {
        this.serverError = constants.generalServerError;
      }
      if (
        error instanceof HttpErrorResponse &&
        (error.status === 401 || error.status === 403)
      ) {
        this.authorizationService.removeToken();
        this.router.navigate(['/login']);
      }
    }
  }


  async deleteAccount(): Promise<void> {
    const confirmDelete = confirm('¿Estás seguro de que quieres borrar tu cuenta? Esta acción es irreversible.');

    if (confirmDelete) {
      this.serverError = '';
      this.serverSuccess = '';
      try {
        const token = this.authorizationService.getToken();
        if (!token) {
          throw new Error('No se encontró el token de autenticación para eliminar la cuenta.');
        }
        await this.usersService.remove(token);
        alert('¡Tu cuenta ha sido eliminada con éxito!');
        this.authorizationService.removeToken(); 
        this.router.navigate(['/login']); 
      } catch (error) {
        console.error('Error al borrar la cuenta:', error);
        if (error instanceof HttpErrorResponse) {
          this.serverError = error.error?.message || 'Error al borrar la cuenta.';
        } else {
          this.serverError = 'Error al borrar la cuenta. Inténtalo de nuevo.';
        }
        // Manejo de errores de autorización
        if (
          error instanceof HttpErrorResponse &&
          (error.status === 401 || error.status === 403)
        ) {
          this.authorizationService.removeToken();
          this.router.navigate(['/login']);
        }
      }
    }
  }
}