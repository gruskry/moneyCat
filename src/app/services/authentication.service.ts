import { Observable } from 'rxjs';
import { ExpenseService } from './expense.service';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { BehaviorSubject, from } from 'rxjs';
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
    private auth: Auth,
    private expenseSerice: ExpenseService,
    private _route: Router) { }

  isLogin(): boolean{
    return this.isLoggedIn.value;
  }

  singIn(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  singUp(email: string, password: string): Promise<any>  {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  logout(): void {
    localStorage.clear();
    this.auth.signOut();
  }

  setTokens(userTmpl): void {
    localStorage.setItem('access_token', userTmpl._tokenResponse.idToken);
    localStorage.setItem('refresh_token', userTmpl._tokenResponse.refreshToken);
    localStorage.setItem('user_uid', userTmpl.user.uid);
  }
}
