import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Auth } from 'src/entities/auth';
import { UsersServerService } from 'src/services/users-server.service';
import { Login } from 'src/shared/auth.actions';
import { AuthState } from 'src/shared/auth.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  auth: Auth = new Auth();
  hide = true;

  constructor(
    private usersServerService: UsersServerService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {}

  get vypisAuth() {
    return JSON.stringify(this.auth);
  }

  formSubmit() {
    this.store.dispatch(new Login(this.auth)).subscribe(() => {
      this.router.navigateByUrl(this.store.selectSnapshot(AuthState.redirectUrl));
    });
    // this.usersServerService.login(this.auth).subscribe((ok) => {
      // this.router.navigateByUrl(this.usersServerService.redirectAfterLogin);
      // this.usersServerService.redirectAfterLogin = '/users/extended';
    // });
  }
}
