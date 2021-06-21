import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map } from 'rxjs/operators';
import { query, QueryOutput } from 'rx-query';
import { of, throwError } from 'rxjs';

const defaultConfig = {
  cacheTime: 30_000,
  staleTime: 5_000,
  refetchOnWindowFocus: false,
  retries: 3
};

@Injectable({
  providedIn: 'root'
})
export class SampleService extends HttpClient {
  BASE_URL = 'https://6089b8b68c8043001757f52f.mockapi.io/tag';

  create(updatedValues, dateNow) {
    return query(
      'tag',
      dateNow,
      () => {
        const fail = Math.random() > 0.5;
        if (fail) {
          return of(null).pipe(
            delay(1000),
            map(() => {
              throw Error('random');
            }),
            catchError(err => throwError(err))
          );
        }

        return this.post<any>(this.BASE_URL, updatedValues).pipe(delay(1000));
      },
      defaultConfig
    );
  }

  read() {
    return query('tag', () => this.get<any[]>(this.BASE_URL), defaultConfig);
  }

  update(id, updatedValues) {
    return query(
      'tag',
      id,
      () => this.put<any>(`${this.BASE_URL}/${id}`, updatedValues),
      defaultConfig
    );
  }

  destroy(id) {
    return query(
      'tag',
      id,
      () => this.delete<any>(`${this.BASE_URL}/${id}`),
      defaultConfig
    );
  }
}
