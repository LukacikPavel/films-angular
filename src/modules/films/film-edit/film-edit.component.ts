import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Film } from 'src/entities/film';
import { CanDeactivateComponent } from 'src/guards/can-deactivate.guard';
import { ConfirmDialogComponent } from 'src/modules/users/confirm-dialog/confirm-dialog.component';
import { FilmsServerService } from 'src/services/films-server.service';

@Component({
  selector: 'app-film-edit',
  templateUrl: './film-edit.component.html',
  styleUrls: ['./film-edit.component.css'],
})
export class FilmEditComponent implements OnInit, CanDeactivateComponent {
  filmToEdit: Film;
  filmSaved = false;

  constructor(
    private route: ActivatedRoute,
    private filmsServerService: FilmsServerService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  
  canDeactivate(): Observable<boolean>|boolean{
    if(this.filmSaved){
      return true;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Leaving?',
        message: 'Edited film is not saved, leave?',
      },
    });
    return dialogRef.afterClosed().pipe(map((result) => !!result));
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.filmToEdit = data.film;
      this.filmSaved = false;
    });
  }

  saveFilm(film: Film) {
    this.filmsServerService
      .saveFilm(film)
      .subscribe(() => {
        this.router.navigateByUrl('/films');
        this.filmSaved = true;
      });
  }
}
