import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginBody } from '../models/user.model';
import { MessageResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly #httpClient = inject(HttpClient);

  login(loginBody: LoginBody) {
    return this.#httpClient.post<MessageResponse>('/users/login', loginBody);
  }
}
