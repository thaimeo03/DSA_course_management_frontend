import { CourseState } from 'stores/reducers/course.reducer';

export const selectCourseData = (state: { course: CourseState }) =>
  state.course;
