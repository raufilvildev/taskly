import { CanActivateFn } from '@angular/router';

export const courseGuard: CanActivateFn = (route, state) => {
  return true;
};
