import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetMeResponse, LoginBody, RegisterBody } from '../models/user';
import { MessageResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly #httpClient = inject(HttpClient);

  login(loginBody: LoginBody) {
    return this.#httpClient.post<MessageResponse>('/users/login', loginBody);
  }

  register(registerBody: RegisterBody) {
    return this.#httpClient.post<MessageResponse>(
      '/users/register',
      registerBody,
    );
  }

  logout() {
    return this.#httpClient.get<MessageResponse>('/users/logout');
  }

  getMe() {
    return this.#httpClient.get<GetMeResponse>('/users/me');
  }
}
