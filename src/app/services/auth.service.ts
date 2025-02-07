import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #httpClient = inject(HttpClient);

  refreshToken() {
    return this.#httpClient.get('/auth/refresh-token');
  }
}
