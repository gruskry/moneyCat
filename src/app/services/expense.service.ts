import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  currentUserSubj: BehaviorSubject<string> = new BehaviorSubject('');
  chosenDate: BehaviorSubject<string> = new BehaviorSubject('');
  date: string;
constructor(
  public auth: Auth,
  public db: Firestore,
  public datePipe: DatePipe,
  ) {}

  setOptions(options) {
    options.forEach(el => this.date = el.date);
    this.date = this.datePipe.transform(this.date, 'ddMMyyyy');
    setDoc(doc(this.db, `users/${this.currentUserSubj.value}/date/${this.date}`), {options})
  }

  getOptions() {
    let currentDate = new Date();
    let newDateFormat = this.datePipe.transform(currentDate, 'MMddyyyy');

    (!this.chosenDate.value) ? this.chosenDate.next(newDateFormat) : '';
    return getDoc(doc(this.db, `users/${this.currentUserSubj.value}/date/${this.chosenDate.value}`))
  }
}
