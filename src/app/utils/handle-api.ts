import { HttpParams } from '@angular/common/http';

export const getHttpParams = (params: Record<string, any>) => {
  let httpParams = new HttpParams();

  for (const key in params) {
    if (
      params.hasOwnProperty(key) &&
      params[key] !== undefined &&
      params[key] !== null
    ) {
      httpParams = httpParams.set(key, params[key]);
    }
  }

  return httpParams;
};
