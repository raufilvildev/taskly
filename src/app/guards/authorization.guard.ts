import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { AuthorizationService } from '../services/authorization.service';

const authorizationGuard = (param: string): CanActivateFn => {
  if (!['public', 'private'].includes(param)) {
    throw new Error("Los únicos parámetros permitidos son 'public' y 'private'.");
  }

  return async (route, state) => {
    const router = inject(Router);
    const usersService = inject(UsersService);
    const authorizationService = inject(AuthorizationService);

    const token = authorizationService.getToken();

    if (!token) {
      if (param === 'public') return true;

      await router.navigate(['home']);
      return false;
    }

    try {
      const { email_confirmed } = await usersService.getByToken();
      if (!email_confirmed) {
        if (state.url === '/signup/signup_confirmation') return true;
        await router.navigate(['signup', 'signup_confirmation']);
        return false;
      }

      if (param === 'public') {
        await router.navigate(['dashboard']);
        return false;
      }

      return true;
    } catch (error) {
      authorizationService.removeToken();

      if (param === 'public') return true;

      await router.navigate(['home']);
      return false;
    }
  };
};

export const authorizationGuardPublic: CanActivateFn = authorizationGuard('public');
export const authorizationGuardPrivate: CanActivateFn = authorizationGuard('private');
