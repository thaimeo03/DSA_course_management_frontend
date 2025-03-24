import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { CourseService } from '@app/services/course.service';
import { injectQuery } from '@bidv-api/angular';
import { Store } from '@ngrx/store';
import { setCourseData } from 'stores/actions/course.action';
import { selectCourseData } from 'stores/selectors/course.selector';

export const courseGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const courseService = inject(CourseService);
  const store = inject(Store);
  const query = injectQuery();

  let isPurchased = false;

  store.select(selectCourseData).subscribe((course) => {
    isPurchased = course.isPurchased;
  });

  if (isPurchased) return true;

  const id = route.paramMap.get('id');
  if (!id) return false;

  const isPurchasedQuery = query({
    queryKey: ['isPurchased'],
    queryFn: () => courseService.isPurChasedCourse(id),
    retry: 0,
  });

  isPurchasedQuery.result$.subscribe((res) => {
    if (res.isSuccess) {
      const data = res.data;

      if (data.data) {
        store.dispatch(setCourseData({ isPurchased: data.data }));
      } else {
        router.navigate([ROUTES.detailCourse, id]);
      }
    }
    if (res.isError) {
      router.navigate([ROUTES.home]);
    }
  });

  return true;
};
