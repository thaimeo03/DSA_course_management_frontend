import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, exhaustMap, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('/auth/refresh-token')) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // Handle call api refresh token
        if (err.status === 401) {
          return this.authService.refreshToken().pipe(
            exhaustMap(() => next.handle(req)),
            catchError((err: HttpErrorResponse) => {
              return throwError(() => err);
            }),
          );
        }

        return throwError(() => err);
      }),
    );
  }
}
