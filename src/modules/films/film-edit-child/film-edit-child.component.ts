import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { Clovek } from 'src/entities/clovek';
import { Film } from 'src/entities/film';
import { Postava } from 'src/entities/postava';

@Component({
  selector: 'app-film-edit-child',
  templateUrl: './film-edit-child.component.html',
  styleUrls: ['./film-edit-child.component.css'],
})
export class FilmEditChildComponent implements OnChanges {
  @Input() film: Film;
  @Output() changed = new EventEmitter<Film>();
  filmEditForm = new FormGroup({
    nazov: new FormControl('', [Validators.required, Validators.minLength(3)]),
    slovenskyNazov: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    rok: new FormControl('', Validators.required),
    imdbID: new FormControl(''),
    postava: new FormArray([]),
    reziser: new FormArray([]),
    poradieVRebricku: new FormArray([]),
  });

  constructor() {}

  ngOnChanges(): void {
    if (this.film) {
      this.nazov.setValue(this.film.nazov);
      this.slovenskyNazov.setValue(this.film.slovenskyNazov);
      this.rok.setValue(this.film.rok == -1 ? '' : this.film.rok);
      this.imdbID.setValue(this.film.imdbID);
      this.film.postava.forEach((postava) => {
        this.postava.push(this.createPostavaFormGroup(postava));
      });
      this.film.reziser.forEach((reziser) => {
        this.reziser.push(this.createClovekFormGroup(reziser));
      });
      Object.entries(this.film.poradieVRebricku).forEach(([key, value]) => {
        this.poradieVRebricku.push(
          this.createPoradieVRebrickuFormGroup(key, value)
        );
      });
    }
  }

  createPoradieVRebrickuFormGroup(key, value) {
    return new FormGroup({
      rebricek: new FormControl(key, Validators.required),
      poradie: new FormControl(value, Validators.required),
    });
  }

  createPostavaFormGroup(postava: Postava) {
    return new FormGroup({
      postava: new FormControl(postava.postava, Validators.required),
      dolezitost: new FormControl(postava.dolezitost, Validators.required),
      herec: this.createClovekFormGroup(postava.herec),
    });
  }

  createClovekFormGroup(clovek: Clovek) {
    return new FormGroup({
      id: new FormControl(clovek.id),
      krstneMeno: new FormControl(clovek.krstneMeno, Validators.required),
      stredneMeno: new FormControl(clovek.stredneMeno),
      priezvisko: new FormControl(clovek.priezvisko, Validators.required),
    });
  }

  get nazov() {
    return this.filmEditForm.get('nazov') as FormControl;
  }

  get slovenskyNazov() {
    return this.filmEditForm.get('slovenskyNazov') as FormControl;
  }

  get rok() {
    return this.filmEditForm.get('rok') as FormControl;
  }

  get imdbID() {
    return this.filmEditForm.get('imdbID') as FormControl;
  }

  get postava() {
    return this.filmEditForm.get('postava') as FormArray;
  }

  get reziser() {
    return this.filmEditForm.get('reziser') as FormArray;
  }

  get poradieVRebricku() {
    return this.filmEditForm.get('poradieVRebricku') as FormArray;
  }

  addEmptyPostava() {
    this.postava.push(
      this.createPostavaFormGroup(new Postava('', '', new Clovek('')))
    );
  }
  addEmptyReziser() {
    this.reziser.push(this.createClovekFormGroup(new Clovek('')));
  }

  addEmptyPoradieVRebricku() {
    this.poradieVRebricku.push(this.createPoradieVRebrickuFormGroup('', ''));
  }

  deletePostavaAt(index: number) {
    this.postava.removeAt(index);
  }

  deleteReziserAt(index: number) {
    this.reziser.removeAt(index);
  }

  deletePoradieVRebrickuAt(index: number) {
    this.poradieVRebricku.removeAt(index);
  }

  getPoradieVRebrickuObject() {
    var object = {};
    this.poradieVRebricku.value.forEach((element) => {
      object[element.rebricek] = element.poradie;
    });
    return object;
  }

  formSubmit() {
    const film = new Film(
      this.nazov.value,
      this.rok.value,
      this.film.id,
      this.imdbID.value,
      this.slovenskyNazov.value,
      this.getPoradieVRebrickuObject(),
      this.reziser.value,
      this.postava.value
    );
    this.changed.next(film);
  }
}
