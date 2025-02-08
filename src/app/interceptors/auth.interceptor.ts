import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, exhaustMap, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ROUTES } from '../constants/routes';

export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private authService = inject(AuthService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    console.log('Auth Interceptor');
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // Handle call api refresh token
        if (err.status === 401) {
          return this.authService.refreshToken().pipe(
            exhaustMap(() => next.handle(req)),
            catchError(() => {
              this.router.navigate([ROUTES.login]);
              return throwError(() => new Error('Unauthorized'));
            }),
          );
        }

        return throwError(() => err);
      }),
    );
  }
}
