import { LectureData } from '@app/models/lecture';
import { createReducer, on } from '@ngrx/store';
import { setLectureData } from 'stores/actions/lecture.action';

export interface LectureState {
  lectureData: LectureData | null; // Replace 'any' with the appropriate type
  quantity: number;
}

const initialState: LectureState = {
  lectureData: null,
  quantity: 0,
};

export const lectureReducer = createReducer(
  initialState,
  on(setLectureData, (state, lecture) => ({
    ...state,
    ...lecture,
  })),
);
