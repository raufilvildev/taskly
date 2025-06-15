import { HttpInterceptorFn } from '@angular/common/http';

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const reqClone = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });
    return next(reqClone);
  }

  return next(req);
};
