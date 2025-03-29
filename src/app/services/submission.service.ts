import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ExecuteCodeBody,
  ExecuteCodeResponse,
  GetSubmissionHistoryResponse,
} from '@app/models/submission';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  readonly #httpClient = inject(HttpClient);

  executeCode(body: ExecuteCodeBody) {
    return this.#httpClient.post<ExecuteCodeResponse>(
      '/submissions/execute-code',
      body,
    );
  }

  getSubmissionHistory(problemId: string) {
    return this.#httpClient.get<GetSubmissionHistoryResponse>(
      `/submissions/me/history/${problemId}`,
    );
  }
}
