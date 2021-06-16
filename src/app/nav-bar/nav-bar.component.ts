import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UsersServerService } from 'src/services/users-server.service';
import { Logout } from 'src/shared/auth.actions';
import { AuthModel, AuthState } from 'src/shared/auth.state';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  username: string = '';
  // @Select(AuthState) authState$: Observable<AuthModel>;
  // @Select(state => state.auth.username) username$: Observable<string>;
  @Select(AuthState.username) username$: Observable<string>;

  constructor(
    private usersServerService: UsersServerService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    // this.authState$.subscribe((authModel) => {
    //   this.username = authModel.username;
    // });
    this.username$.subscribe((username) => {
      this.username = username;
    });
  }

  logout() {
    this.store.dispatch(new Logout()).subscribe(() => {
      this.router.navigateByUrl('/login');
    })
  }
}
