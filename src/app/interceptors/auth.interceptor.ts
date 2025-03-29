import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private isRefreshing = false; // Flag to check if the refresh token process is ongoing
  private refreshTokenSubject: BehaviorSubject<boolean | null> =
    new BehaviorSubject<boolean | null>(null);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Skip refresh token requests
    if (req.url.includes('/auth/refresh-token')) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => err);
      }),
    );
  }

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // Reset the refresh token queue

      return this.authService.refreshToken().pipe(
        switchMap(() => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(true); // Notify that the refresh token process is complete
          return next.handle(req); // Retry the original request
        }),
        catchError((err: HttpErrorResponse) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(false); // Notify that the refresh token process failed
          return throwError(() => err);
        }),
      );
    } else {
      // If the refresh token process is ongoing, wait until it completes
      return this.refreshTokenSubject.pipe(
        filter((status) => status !== null), // Continue only when the refresh token process is complete
        take(1), // Take the first value (true or false)
        switchMap((status) => {
          if (status) {
            return next.handle(req); // Retry the request if the refresh token process succeeded
          } else {
            return throwError(
              () =>
                new HttpErrorResponse({
                  status: 401,
                  statusText: 'Unauthorized',
                }),
            );
          }
        }),
      );
    }
  }
}
