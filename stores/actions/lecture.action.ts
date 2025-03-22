import { createAction, props } from '@ngrx/store';
import { LectureState } from 'stores/reducers/lecture.reducer';

export const setLectureData = createAction(
  '[Lecture] Set Lecture Data',
  props<Partial<LectureState>>(),
);
