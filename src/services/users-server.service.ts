import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { EMPTY, Observable, of, Subscriber, throwError } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { Auth } from 'src/entities/auth';
import { Group } from 'src/entities/group';
import { User } from 'src/entities/user';
import { TokenExpiredLogout } from 'src/shared/auth.actions';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class UsersServerService {
  localUsers = [
    new User('Janka', 'janka@janka.sk'),
    new User('Danka', 'danka@danka.sk'),
  ];

  url = 'http://localhost:8080/';
  // loggedUserSubscriber: Subscriber<string>;
  // redirectAfterLogin = "/users/extended";

  constructor(
    private http: HttpClient,
    private snackBarService: SnackbarService,
    private store: Store
  ) {}

  // getCurrentUser(): Observable<string> {
  //   return new Observable<string>((subscriber) => {
  //     // this.loggedUserSubscriber = subscriber;
  //     subscriber.next(this.user);
  //   });
  // }

  checkToken(): Observable<void> {
    if (this.token == null) {
      return of(undefined);
    }

    return this.http
      .get(this.url + 'check-token/' + this.token, {
        responseType: 'text',
      })
      .pipe(
        mapTo(undefined),
        catchError((error) => this.processHttpError(error))
      );
  }

  get token(): string {
    return this.store.selectSnapshot((state) => state.auth.token);
  }

  getLocalUsers(): Observable<User[]> {
    return of(this.localUsers);
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.url + 'users')
      .pipe(catchError((error) => this.processHttpError(error)));
  }

  getGroups(): Observable<Group[]> {
    return this.http
      .get<Group[]>(this.url + 'groups')
      .pipe(catchError((error) => this.processHttpError(error)));
  }

  getExtendedUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.url + 'users/' + this.token)
      .pipe(catchError((error) => this.processHttpError(error)));
  }

  getUser(id: number): Observable<User> {
    return this.http
      .get<User>(this.url + 'user/' + id + '/' + this.token)
      .pipe(catchError((error) => this.processHttpError(error)));
  }

  saveUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.url + 'users/' + this.token, user)
      .pipe(catchError((error) => this.processHttpError(error)));
  }

  login(auth: Auth): Observable<string> {
    return this.http
      .post(this.url + 'login', auth, { responseType: 'text' })
      .pipe(
        tap((token) => {
          // this.token = token;
          // this.user = auth.name;
          // this.loggedUserSubscriber.next(this.user);
          this.snackBarService.successMessage('Login sucessful');
        }),
        catchError((error) => this.processHttpError(error))
      );
  }

  logout(token): Observable<void> {
    // this.user = null;
    // this.loggedUserSubscriber.next(null);
    return this.http.get(this.url + 'logout/' + token).pipe(
      mapTo(undefined),
      catchError((error) => this.processHttpError(error))
    );
    // this.token = null;
  }

  userConflicts(user: User): Observable<string[]> {
    return this.http
      .post<string[]>(this.url + 'user-conflicts', user)
      .pipe(catchError((error) => this.processHttpError(error)));
  }

  register(user: User): Observable<User> {
    return this.http
      .post<User>(this.url + 'register', user)
      .pipe(catchError((error) => this.processHttpError(error)));
  }

  deleteUser(userId: number): Observable<boolean> {
    return this.http
      .delete(this.url + 'user/' + userId + '/' + this.token)
      .pipe(mapTo(true))
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
