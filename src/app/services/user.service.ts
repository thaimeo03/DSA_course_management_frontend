import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetMeResponse, LoginBody, RegisterBody } from '../models/user';
import { MessageResponse } from '../models';
import {
  injectMutation,
  injectQuery,
  QueryClient,
  QueryObserver,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private queryClient = new QueryClient();
  readonly #httpClient = inject(HttpClient);

  // Logic mutation
  loginMutation() {
    return injectMutation(() => ({
      mutationFn: (body: LoginBody) => this.login(body),
      retry: 2,
    }));
  }

  registerMutation() {
    return injectMutation(() => ({
      mutationFn: (body: RegisterBody) => this.login(body),
      retry: 2,
    }));
  }

  // API
  login(loginBody: LoginBody) {
    return lastValueFrom(
      this.#httpClient.post<MessageResponse>('/users/login', loginBody),
    );
  }

  register(registerBody: RegisterBody) {
    return lastValueFrom(
      this.#httpClient.post<MessageResponse>('/users/register', registerBody),
    );
  }

  getMe() {
    return lastValueFrom(this.#httpClient.get<GetMeResponse>('/users/me'));
  }
}
