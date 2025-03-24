import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BidvRootModule } from '@bidv-ui/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideInterceptors } from './interceptors';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { provideStore } from '@ngrx/store';
import { authReducer } from 'stores/reducers/auth.reducer';
import { lectureReducer } from 'stores/reducers/lecture.reducer';
import { courseReducer } from 'stores/reducers/course.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(BidvRootModule),
    provideTanStackQuery(new QueryClient()),
    provideHttpClient(withInterceptorsFromDi()), // DI-based interceptors must be explicitly enabled.
    ...provideInterceptors,
    provideStore({
      auth: authReducer,
      lecture: lectureReducer,
      course: courseReducer,
    }),
  ],
};
