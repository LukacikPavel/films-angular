import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Film } from 'src/entities/film';
import { CanDeactivateComponent } from 'src/guards/can-deactivate.guard';
import { ConfirmDialogComponent } from 'src/modules/users/confirm-dialog/confirm-dialog.component';
import { FilmsServerService } from 'src/services/films-server.service';

@Component({
  selector: 'app-film-add',
  templateUrl: './film-add.component.html',
  styleUrls: ['./film-add.component.css'],
})
export class FilmAddComponent implements OnInit, CanDeactivateComponent {
  filmToEdit = new Film('', -1);
  filmSaved = false;

  constructor(
    private filmsServerService: FilmsServerService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  canDeactivate(): Observable<boolean>|boolean{
    if(this.filmSaved){
      return true;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Leaving?',
        message: 'Film is not saved, leave?',
      },
    });
    return dialogRef.afterClosed().pipe(map((result) => !!result));
  }

  saveFilm(film: Film) {
    this.filmsServerService.saveFilm(film).subscribe(() => {
      this.router.navigateByUrl('/films');
      this.filmSaved = true;
    });
  }
}
