import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Film } from 'src/entities/film';
import { FilmsServerService } from 'src/services/films-server.service';

@Injectable({
  providedIn: 'root'
})
export class FilmResolverService implements Resolve<Film>{

  constructor(private filmsServerService:FilmsServerService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Film> {
    return this.filmsServerService.getFilm(+route.paramMap.get("id"));
  }
}
