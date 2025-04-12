import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageResponse } from '@app/models';
import {
  CreateProblemBody,
  CreateProblemResponse,
  GetProblemDetailResponse,
  GetProblemRepositoryParams,
  ProblemRepositoryResponse,
  UpdateProblemBody,
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

  updateProblem(id: string, body: UpdateProblemBody) {
    return this.#httpClient.patch<MessageResponse>(`/problems/${id}`, body);
  }

  getProblemDetail(id: string) {
    return this.#httpClient.get<GetProblemDetailResponse>(`/problems/${id}`);
  }

  deleteProblem(id: string) {
    return this.#httpClient.delete<MessageResponse>(`/problems/${id}`);
  }

  activeProblem(id: string) {
    return this.#httpClient.patch<MessageResponse>(
      `/problems/active/${id}`,
      null,
    );
  }

  inactiveProblem(id: string) {
    return this.#httpClient.patch<MessageResponse>(
      `/problems/inactive/${id}`,
      null,
    );
  }

  archiveProblem(id: string) {
    return this.#httpClient.patch<MessageResponse>(
      `/problems/archive/${id}`,
      null,
    );
  }
}
