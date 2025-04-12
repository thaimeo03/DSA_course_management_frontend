import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageResponse } from '@app/models';
import {
  CreateTemplateBody,
  GetTemplateParams,
  GetTemplateResponse,
  UpdateTemplateBody,
} from '@app/models/template';
import { getHttpParams } from '@app/utils/handle-api';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  readonly #httpClient = inject(HttpClient);

  getTemplate(params: GetTemplateParams) {
    const httpParams = getHttpParams(params);

    return this.#httpClient.get<GetTemplateResponse>('/templates/problem', {
      params: httpParams,
    });
  }

  createTemplate(body: CreateTemplateBody) {
    return this.#httpClient.post<MessageResponse>('/templates', body);
  }

  updateTemplate(id: string, body: UpdateTemplateBody) {
    return this.#httpClient.patch<MessageResponse>(`/templates/${id}`, body);
  }

  deleteTemplate(id: string) {
    return this.#httpClient.delete<MessageResponse>(`/templates/${id}`);
  }
}
