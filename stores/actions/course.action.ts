import { createAction, props } from '@ngrx/store';
import { CourseState } from 'stores/reducers/course.reducer';

export const setCourseData = createAction(
  '[Course] Set Course Data',
  props<Partial<CourseState>>(),
);
