import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageResponse } from '@app/models';
import {
  CreateTestSuiteBody,
  GetTestSuiteResponse,
  UpdateTestSuiteBody,
} from '@app/models/test-suite';

@Injectable({
  providedIn: 'root',
})
export class TestSuiteService {
  readonly #httpClient = inject(HttpClient);

  getTestSuiteByProblemId(problemId: string) {
    return this.#httpClient.get<GetTestSuiteResponse>(
      `/test-suits/problem/${problemId}`,
    );
  }

  createTestSuite(body: CreateTestSuiteBody) {
    return this.#httpClient.post<MessageResponse>('/test-suits', body);
  }

  updateTestSuite(id: string, body: UpdateTestSuiteBody) {
    return this.#httpClient.patch<MessageResponse>(`/test-suits/${id}`, body);
  }

  deleteTestSuite(id: string) {
    return this.#httpClient.delete<MessageResponse>(`/test-suits/${id}`);
  }
}
