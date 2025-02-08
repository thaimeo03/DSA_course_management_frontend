import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BidvAlertService } from '@bidv-ui/core';
import { catchError, Observable, throwError } from 'rxjs';

export class CachingInterceptor implements HttpInterceptor {
  private readonly alerts = inject(BidvAlertService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 500 || err.status === 0) {
          this.alerts.open(err.statusText, { status: 'error' }).subscribe();
        }

        return throwError(() => err);
      }),
    );
  }
}
