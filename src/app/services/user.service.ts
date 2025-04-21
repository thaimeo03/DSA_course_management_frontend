import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  GetMeResponse,
  GetRanksParams,
  GetRanksResponse,
  LoginBody,
  RegisterBody,
  UpdateProfileBody,
} from '../models/user';
import { MessageResponse } from '../models';
import { getHttpParams } from '@app/utils/handle-api';

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

  updateProfile(body: UpdateProfileBody) {
    return this.#httpClient.patch<MessageResponse>(
      '/users/update/profile',
      body,
    );
  }

  getRanks(params: GetRanksParams) {
    const httpParams = getHttpParams(params);

    return this.#httpClient.get<GetRanksResponse>('/users/ranks', {
      params: httpParams,
    });
  }
}
