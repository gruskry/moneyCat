import { CurrencyModel } from './../models/currency.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { doc, setDoc, Firestore, getDoc } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class ExpenseService {
  chosenDate: BehaviorSubject<string> = new BehaviorSubject('');
  date: string;
  key: string = 'a6eb7b27036401f48cc7';
  constructor(
    public datePipe: DatePipe,
    public db: Firestore,
    private http: HttpClient,
  ) {}

  setOptions(options) {
    options.forEach(el => this.date = el.date);
    this.date = this.datePipe.transform(this.date, 'MMddyyyy');
    setDoc(doc(this.db, `users/${localStorage.getItem('user_uid')}/date/${this.date}`), {options})
  }

  getFullOptions() {
    return getDoc(doc(this.db, `users/${localStorage.getItem('user_uid')}/date/`))
  }

  getOptionsDate() {
    let currentDate = new Date();
    let newDateFormat = this.datePipe.transform(currentDate, 'MMddyyyy');

    (!this.chosenDate.value) ? this.chosenDate.next(newDateFormat) : '';

    return getDoc(doc(this.db, `users/${localStorage.getItem('user_uid')}/date/${this.chosenDate.value}`))
  }

  getCurrencies(): Observable<CurrencyModel[]> {
    return this.http.get<CurrencyModel[]>('https://www.nbrb.by/api/exrates/rates?periodicity=0').pipe(map(options => options));
  }
}
