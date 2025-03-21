import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetActiveLecturesResponse } from '@app/models/lecture';

@Injectable({
  providedIn: 'root',
})
export class LectureService {
  readonly #httpClient = inject(HttpClient);

  getAllActiveLectures(courseId: string) {
    return this.#httpClient.get<GetActiveLecturesResponse>(
      `/lessons/course/active/${courseId}`,
    );
  }
}
