import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(public auth: Auth) { }

  logginState() {
    this.auth.onAuthStateChanged((user) => {
      user ? this.isLoggedIn.next(true) : this.isLoggedIn.next(false);
    })
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
