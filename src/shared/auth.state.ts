import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { UsersServerService } from 'src/services/users-server.service';
import {
  Login,
  Logout,
  TokenExpiredLogout,
  UrlAfterLogin,
} from './auth.actions';

const DEFAULT_REDIRECT_AFTER_LOGIN = '/users/extended';

export interface AuthModel {
  username: string;
  token: string;
  redirectAfterLogin: string;
}

@State<AuthModel>({
  name: 'auth',
  defaults: {
    username: null,
    token: null,
    redirectAfterLogin: DEFAULT_REDIRECT_AFTER_LOGIN,
  },
})
@Injectable()
export class AuthState {
  @Selector([(state) => state.auth.username])
  static username(username: string) {
    return username;
  }

  @Selector([(state) => state.auth.redirectAfterLogin])
  static redirectUrl(url: string) {
    return url;
  }

  constructor(private usersServerService: UsersServerService) {}

  ngxsOnInit() {
    this.usersServerService.checkToken().subscribe();
  }

  @Action(Login)
  login(ctx: StateContext<AuthModel>, action: Login) {
    console.log('spracovavam udalost Login pre meno ' + action.auth.name);
    return this.usersServerService.login(action.auth).pipe(
      tap((token) => {
        ctx.patchState({
          username: action.auth.name,
          token,
        });
      })
    );
  }

  @Action([Logout, TokenExpiredLogout], { cancelUncompleted: true })
  logout(ctx: StateContext<AuthModel>, action: Logout | TokenExpiredLogout) {
    const token = ctx.getState().token;
    ctx.setState({
      username: null,
      token: null,
      redirectAfterLogin: DEFAULT_REDIRECT_AFTER_LOGIN,
    });

    if (action instanceof Logout) {
      return this.usersServerService.logout(token);
    }
  }

  @Action(UrlAfterLogin)
  setUrlAfterLogin(ctx: StateContext<AuthModel>, action: UrlAfterLogin) {
    ctx.patchState({
      redirectAfterLogin: action.url,
    });
  }
}
