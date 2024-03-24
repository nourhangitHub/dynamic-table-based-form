import { Injectable } from '@angular/core';
import { Field } from '../interfaces/field.interface';
import { Observable, ReplaySubject, distinctUntilChanged, pairwise } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private Fields$ = new ReplaySubject(2);

  getFields(): Observable<any> { 
    return this.Fields$.pipe(
      distinctUntilChanged(),
      pairwise(),
    ); 
  }
  
  emitFields(type: any | null): void { 
    this.Fields$.next(type);
  }

  storeData(data: Field[]): void{
    this.emitFields(data);
    localStorage.setItem("fields", JSON.stringify(data));
  }

  getData(): Field[]{
    return JSON.parse(localStorage.getItem("fields") || "") ;
  }
}
