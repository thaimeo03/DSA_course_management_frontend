import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  GetProblemRepositoryParams,
  ProblemRepositoryResponse,
} from '@app/models/problem';
import { getHttpParams } from '@app/utils/handle-api';

@Injectable({
  providedIn: 'root',
})
export class ProblemService {
  readonly #httpClient = inject(HttpClient);

  getActiveProblems(id: string, params: GetProblemRepositoryParams) {
    const httpParams = getHttpParams(params);

    return this.#httpClient.get<ProblemRepositoryResponse>(
      `/problems/course/active/${id}`,
      {
        params: httpParams,
      },
    );
  }
}
