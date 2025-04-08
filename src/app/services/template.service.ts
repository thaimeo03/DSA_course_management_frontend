import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetTemplateParams, GetTemplateResponse } from '@app/models/template';
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
}
