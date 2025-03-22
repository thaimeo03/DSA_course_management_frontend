import { LectureState } from 'stores/reducers/lecture.reducer';

export const selectLectureData = (state: { lecture: LectureState }) =>
  state.lecture;
