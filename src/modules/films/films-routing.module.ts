import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { CanDeactivateGuard } from 'src/guards/can-deactivate.guard';
import { FilmResolverService } from 'src/guards/film-resolver.service';
import { FilmAddComponent } from './film-add/film-add.component';
import { FilmDetailComponent } from './film-detail/film-detail.component';
import { FilmEditComponent } from './film-edit/film-edit.component';
import { FilmsListComponent } from './films-list/films-list.component';
import { FilmsMenuComponent } from './films-menu/films-menu.component';

const routes: Routes = [
  {
    path: '',
    component: FilmsMenuComponent,
    children: [
      {
        path: 'edit/:id',
        component: FilmEditComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
        resolve: { film: FilmResolverService },
      },
      {
        path: 'add',
        component: FilmAddComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: '',
        component: FilmsListComponent,
        children: [{ path: ':id', component: FilmDetailComponent }],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilmsRoutingModule {}
