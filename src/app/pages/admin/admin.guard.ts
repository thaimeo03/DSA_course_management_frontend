import { inject } from '@angular/core';
import { Router, type CanActivateChildFn } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { Role } from '@app/enums/user';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { selectAuthState } from 'stores/selectors/auth.selector';

export const adminGuard: CanActivateChildFn = async (childRoute, state) => {
  const router = inject(Router);
  const store = inject(Store);

  const authState = await firstValueFrom(store.select(selectAuthState));

  const isAdmin = authState.me?.role === Role.Admin;

  if (authState.isAuthenticated && isAdmin) return true;

  router.navigate([ROUTES.home]);
  return false;
};
