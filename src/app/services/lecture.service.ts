import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CreateLectureBody,
  CreateLectureResponse,
  GetActiveLecturesResponse,
  GetAllLecturesResponse,
} from '@app/models/lecture';
import { getHttpParams } from '@app/utils/handle-api';

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

  getAllLectures(courseId: string) {
    return this.#httpClient.get<GetAllLecturesResponse>(
      `/lessons/course/${courseId}`,
    );
  }

  createLecture(body: CreateLectureBody) {
    return this.#httpClient.post<CreateLectureResponse>('/lessons', body);
  }

  getLecture(id: string, params?: any) {
    const httpParams = getHttpParams(params || {});

    return this.#httpClient.get<any>(`/lectures/${id}`, {
      params: httpParams,
    });
  }

  updateLecture(id: string, body: any) {
    return this.#httpClient.patch<any>(`/lectures/${id}`, body);
  }

  deleteLecture(id: string) {
    return this.#httpClient.delete(`/lectures/${id}`);
  }
}
