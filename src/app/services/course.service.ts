import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CreateCourseBody,
  CreateCourseResponse,
  GetActiveCourseParams,
  GetActiveCourseResponse,
  GetAllCoursesParams,
  GetAllCoursesResponse,
  GetDetailCourseParams,
  GetDetailCourseResponse,
  GetPurchasedCoursesParams,
  IsPurchasedCourseResponse,
  UpdateCourseBody,
  UpdateCourseResponse,
} from '@app/models/course';
import { getHttpParams } from '@app/utils/handle-api';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  readonly #httpClient = inject(HttpClient);

  getAllCourses(params: GetAllCoursesParams) {
    const httpParams = getHttpParams(params);

    return this.#httpClient.get<GetAllCoursesResponse>('/courses', {
      params: httpParams,
    });
  }

  getAllActiveCourses(params: GetActiveCourseParams) {
    const httpParams = getHttpParams(params);

    return this.#httpClient.get<GetActiveCourseResponse>('/courses/active', {
      params: httpParams,
    });
  }

  getPurchasedCourses(params: GetPurchasedCoursesParams) {
    const httpParams = getHttpParams(params);

    return this.#httpClient.get<GetActiveCourseResponse>(
      '/courses/active/purchased',
      {
        params: httpParams,
      },
    );
  }

  getDetailCourse(id: string, params: GetDetailCourseParams) {
    const httpParams = getHttpParams(params);

    return this.#httpClient.get<GetDetailCourseResponse>(
      `/courses/detail/${id}`,
      {
        params: httpParams,
      },
    );
  }

  isPurChasedCourse(id: string) {
    return this.#httpClient.get<IsPurchasedCourseResponse>(
      `/courses/is-purchase/${id}`,
    );
  }

  createCourse(body: CreateCourseBody) {
    return this.#httpClient.post<CreateCourseResponse>('/courses', body);
  }

  updateCourse(id: string, body: UpdateCourseBody) {
    return this.#httpClient.patch<UpdateCourseResponse>(`/courses/${id}`, body);
  }

  deleteCourse(id: string) {
    return this.#httpClient.delete(`/courses/${id}`);
  }

  activeCourse(id: string) {
    return this.#httpClient.patch(`/courses/active/${id}`, null);
  }

  inactiveCourse(id: string) {
    return this.#httpClient.patch(`/courses/inactive/${id}`, null);
  }

  archiveCourse(id: string) {
    return this.#httpClient.patch(`/courses/archive/${id}`, null);
  }
}
