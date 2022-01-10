import { ExpenseService } from './expense.service';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { CurrencyModel } from '../models/currency.model';
import { first, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isMainPage:  BehaviorSubject<boolean> = new BehaviorSubject(false);
  currencies: BehaviorSubject<CurrencyModel[]> = new BehaviorSubject([])
  constructor(
    public auth: Auth,
    private expenseSerice: ExpenseService,
    private _route: Router) { }

  logginState(): Observable<boolean> {
    this.auth.onAuthStateChanged((user) => {
      if(user) this.expenseSerice.currentUserSubj.next(user.uid);
      if (user?.emailVerified) {
        this._route.navigateByUrl('/expenses')
        this.isLoggedIn.next(true)
      } else {
        this.isLoggedIn.next(false)
      }
    })
    if(!this.currencies.value.length) {
      this.expenseSerice.getCurrencies().pipe(shareReplay(1),first()).subscribe(data => this.currencies.next(data));
    }
    return this.isLoggedIn.asObservable()
  }

  singIn(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  singUp(email: string, password: string): Promise<any>  {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  logout(): Observable<any> {
    this.isLoggedIn.next(false);
    return from(this.auth.signOut());
  }
}
