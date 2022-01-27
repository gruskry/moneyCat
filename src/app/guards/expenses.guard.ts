import {CanActivate} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getAuth } from "@firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class ExpensesGuard implements CanActivate{

  constructor(public authState: Auth) {}

    canActivate() : Observable<boolean> | boolean{
      let user = this.authState.currentUser;
      if((user && user.emailVerified) || localStorage.getItem('access_token')){
        return true
      }
      else{
        return false
      }
    }
}
