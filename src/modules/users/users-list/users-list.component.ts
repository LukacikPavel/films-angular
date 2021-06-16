import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/entities/user';
import { UsersServerService } from 'src/services/users-server.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  users = [
    new User('Peter', 'peto@peto.sk'),
    new User('Jozo', 'jozo@peto.sk', 2, new Date('2021-02-23')),
    { name: 'Jano', email: 'jano@jano.sk', password: '' },
  ];
  selectedUser: User;
  users$: Observable<User[]>;
  columnsToDisplay = ['id', 'name', 'email'];

  constructor(private usersServerService: UsersServerService) {}

  ngOnInit(): void {
    this.usersServerService.getUsers().subscribe(
      (users) => (this.users = users),
      (error) => {
        window.alert('Mame chybu: ' + JSON.stringify(error));
      }
    );
    // this.users$ = this.usersServerService.getUsers();
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }
}
