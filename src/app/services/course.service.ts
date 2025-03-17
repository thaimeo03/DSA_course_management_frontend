import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  GetActiveCourseParams,
  GetActiveCourseResponse,
} from '@app/models/course';
import { getHttpParams } from '@app/utils/handle-api';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  readonly #httpClient = inject(HttpClient);

  getAllActiveCourses(params: GetActiveCourseParams) {
    const httpParams = getHttpParams(params);

    return this.#httpClient.get<GetActiveCourseResponse>('/courses/active', {
      params: httpParams,
    });
  }
}
