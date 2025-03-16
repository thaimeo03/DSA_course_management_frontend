import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetActiveCourseResponse } from '@app/models/course';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  readonly #httpClient = inject(HttpClient);

  getAllActiveCourses() {
    return this.#httpClient.get<GetActiveCourseResponse>('/courses/active');
  }
}
