import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CreateProblemBody,
  CreateProblemResponse,
  GetProblemRepositoryParams,
  ProblemRepositoryResponse,
} from '@app/models/problem';
import { getHttpParams } from '@app/utils/handle-api';

@Injectable({
  providedIn: 'root',
})
export class ProblemService {
  readonly #httpClient = inject(HttpClient);

  createProblem(body: CreateProblemBody) {
    return this.#httpClient.post<CreateProblemResponse>('/problems', body);
  }

  getActiveProblems(id: string, params: GetProblemRepositoryParams) {
    const httpParams = getHttpParams(params);

    return this.#httpClient.get<ProblemRepositoryResponse>(
      `/problems/course/active/${id}`,
      {
        params: httpParams,
      },
    );
  }

  getAllProblems(id: string, params: GetProblemRepositoryParams) {
    const httpParams = getHttpParams(params);

    return this.#httpClient.get<ProblemRepositoryResponse>(
      `/problems/course/${id}`,
      {
        params: httpParams,
      },
    );
  }
}
