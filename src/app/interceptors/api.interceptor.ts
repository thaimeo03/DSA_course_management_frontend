import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

export class ApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const apiReq = req.clone({
      url: `${environment.apiUrl}${req.url}`,
    });

    return next.handle(apiReq);
  }
}
