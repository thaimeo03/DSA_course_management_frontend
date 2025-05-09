import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageResponse } from '@app/models';
import {
  CreateLectureBody,
  CreateLectureResponse,
  GetActiveLecturesResponse,
  GetAllLecturesResponse,
  GetLectureDetailResponse,
  UpdateLectureBody,
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

  getLectureDetail(id: string) {
    return this.#httpClient.get<GetLectureDetailResponse>(`/lessons/${id}`);
  }

  updateLecture(id: string, body: UpdateLectureBody) {
    return this.#httpClient.patch<MessageResponse>(`/lessons/${id}`, body);
  }

  deleteLecture(id: string) {
    return this.#httpClient.delete<MessageResponse>(`/lessons/${id}`);
  }

  activeLecture(id: string) {
    return this.#httpClient.patch<MessageResponse>(
      `/lessons/active/${id}`,
      null,
    );
  }

  inactiveLecture(id: string) {
    return this.#httpClient.patch<MessageResponse>(
      `/lessons/inactive/${id}`,
      null,
    );
  }

  archiveLecture(id: string) {
    return this.#httpClient.patch<MessageResponse>(
      `/lessons/archive/${id}`,
      null,
    );
  }
}
