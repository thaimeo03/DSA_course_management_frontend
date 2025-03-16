import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { UserService } from '@app/services/user.service';
import { injectQuery } from '@bidv-api/angular';
import { Store } from '@ngrx/store';
import { setAuth } from 'stores/actions/auth.action';
import { selectAuthState } from 'stores/selectors/auth.selector';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userService = inject(UserService);
  const store = inject(Store);
  const query = injectQuery();

  let isAuthenticated = false;

  store.select(selectAuthState).subscribe((auth) => {
    isAuthenticated = auth.isAuthenticated;
  });

  if (isAuthenticated) return true;

  // Call api to check if user is authenticated
  const getMeQuery = query({
    queryKey: ['me'],
    queryFn: () => userService.getMe(),
    retry: 0,
  });

  getMeQuery.result$.subscribe({
    next: (res) => {
      const data = res.data;

      if (data) {
        // Set user data to store
        store.dispatch(setAuth({ isAuthenticated: true, me: data.data }));
      }
    },
    error: () => {
      router.navigate([ROUTES.login]);
    },
  });

  return true;
};
