import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetMyPointResponse } from '@app/models/point';

@Injectable({
  providedIn: 'root',
})
export class PointService {
  readonly #httpClient = inject(HttpClient);

  getMyPoint() {
    return this.#httpClient.get<GetMyPointResponse>('/points/me');
  }
}
