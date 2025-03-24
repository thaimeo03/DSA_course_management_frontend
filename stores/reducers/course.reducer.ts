import { createReducer, on } from '@ngrx/store';
import { setCourseData } from 'stores/actions/course.action';

export interface CourseState {
  isPurchased: boolean;
}

const initialState: CourseState = {
  isPurchased: false,
};

export const courseReducer = createReducer(
  initialState,
  on(setCourseData, (state, course) => ({
    ...state,
    ...course,
  })),
);
