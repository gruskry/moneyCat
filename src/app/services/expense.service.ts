import { CurrencyModel } from './../models/currency.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { getDoc } from 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  currentUserSubj: BehaviorSubject<string> = new BehaviorSubject('');
  chosenDate: BehaviorSubject<string> = new BehaviorSubject('');
  date: string;
  key: string = 'a6eb7b27036401f48cc7';
  constructor(
    public db: Firestore,
    public datePipe: DatePipe,
    private http: HttpClient,
  ) {}

  setOptions(options) {
    options.forEach(el => this.date = el.date);
    this.date = this.datePipe.transform(this.date, 'ddMMyyyy');
    setDoc(doc(this.db, `users/${this.currentUserSubj.value}/date/${this.date}`), {options})
  }

  getFullOptions() {
    return getDoc(doc(this.db, `users/${this.currentUserSubj.value}/date/`))
  }

  getOptionsDate() {
    let currentDate = new Date();
    let newDateFormat = this.datePipe.transform(currentDate, 'MMddyyyy');
    (!this.chosenDate.value) ? this.chosenDate.next(newDateFormat) : '';
    return getDoc(doc(this.db, `users/${this.currentUserSubj.value}/date/${this.chosenDate.value}`))
  }

  getCurrencies(): Observable<CurrencyModel[]> {
    return this.http.get<CurrencyModel[]>('https://www.nbrb.by/api/exrates/rates?periodicity=0').pipe(map(options => options));
  }

  getExchangeRates(currentCurrency: string, selectedCurrency: string):Observable<object> {
    return this.http.get<object>(`https://free.currconv.com/api/v7/convert?q=${currentCurrency}_${selectedCurrency},${selectedCurrency}_${currentCurrency}&compact=ultra&apiKey=${this.key}`)
  }
}
