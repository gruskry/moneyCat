
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { CurrencyModel } from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isMainPage:  BehaviorSubject<boolean> = new BehaviorSubject(false);
  currencies: BehaviorSubject<CurrencyModel[]> = new BehaviorSubject([]);

  constructor(private auth: Auth) {}

  singIn(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
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
