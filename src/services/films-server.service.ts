import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Film } from 'src/entities/film';
import { TokenExpiredLogout } from 'src/shared/auth.actions';
import { SnackbarService } from './snackbar.service';
import { UsersServerService } from './users-server.service';

@Injectable({
  providedIn: 'root',
})
export class FilmsServerService {
  url = 'http://localhost:8080/films';

  constructor(
    private http: HttpClient,
    private usersServerService: UsersServerService,
    private snackBarService: SnackbarService,
    private store: Store
  ) {}

  get token() {
    return this.usersServerService.token;
  }

  private getHeader(): {
    headers?: { 'X-Auth-Token': string };
    params?: HttpParams;
  } {
    return this.token ? { headers: { 'X-Auth-Token': this.token } } : undefined;
  }

  getFilms(
    indexFrom?: number,
    indexTo?: number,
    search?: string,
    orderBy?: string,
    descending?: boolean
  ): Observable<FilmsResponse> {
    let httpOptions = this.getHeader();
    if (indexFrom || indexTo || search || orderBy || descending) {
      httpOptions = { ...(httpOptions || {}), params: new HttpParams() };
    }

    if (indexFrom) {
      httpOptions.params = httpOptions.params.set('indexFrom', '' + indexFrom);
    }

    if (indexTo) {
      httpOptions.params = httpOptions.params.set('indexTo', '' + indexTo);
    }

    if (search) {
      httpOptions.params = httpOptions.params.set('search', search);
    }

    if (orderBy) {
      httpOptions.params = httpOptions.params.set('orderBy', orderBy);
    }

    if (descending) {
      httpOptions.params = httpOptions.params.set('descending', ""+descending);
    }
    return this.http.get<FilmsResponse>(this.url, httpOptions);
  }

  getFilm(id: number){
    return this.http
      .get<Film>(this.url + '/' + id, this.getHeader())
      .pipe(catchError((error) => this.processHttpError(error)));
  }

  saveFilm(film: Film){
    return this.http
      .post<Film>(this.url, film, this.getHeader())
      .pipe(catchError((error) => this.processHttpError(error)));
  }

  private processHttpError(error) {
    if (error instanceof HttpErrorResponse) {
      this.httpErrorToMessage(error);
      return EMPTY;
    }
    return throwError(error);
  }

  private httpErrorToMessage(error: HttpErrorResponse): void {
    if (error.status === 0) {
      this.snackBarService.errorMessage('Server unreachable');
      return;
    }

    if (error.status >= 400 && error.status < 500) {
      const message = error.error.errorMessage
        ? error.error.errorMessage
        : JSON.parse(error.error).errorMessage;
      if (error.status === 401 && message == 'unknown token') {
        this.store.dispatch(new TokenExpiredLogout());
        this.snackBarService.errorMessage('Session timeout');
        return;
      }
      this.snackBarService.errorMessage(message);
      return;
    }
    this.snackBarService.errorMessage('server error: ' + error.message);
  }
}

export interface FilmsResponse {
  items: Film[];
  totalCount: number;
}
