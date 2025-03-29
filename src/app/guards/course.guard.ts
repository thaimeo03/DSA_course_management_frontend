import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { CourseService } from '@app/services/course.service';
import { Store } from '@ngrx/store';
import { setCourseData } from 'stores/actions/course.action';
import { selectCourseData } from 'stores/selectors/course.selector';
import { firstValueFrom } from 'rxjs';

export const courseGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const courseService = inject(CourseService);
  const store = inject(Store);

  const courseData = await firstValueFrom(store.select(selectCourseData));

  if (courseData.isPurchased) return true;

  const id = route.paramMap.get('id');
  if (!id) return false;

  try {
    const res = await firstValueFrom(courseService.isPurChasedCourse(id));
    const data = res.data;

    store.dispatch(setCourseData({ isPurchased: data }));
    return true;
  } catch (error) {
    router.navigate([ROUTES.detailCourse, id]);
    return false;
  }
};
