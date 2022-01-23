import {CanActivate} from "@angular/router";
import {Observable} from "rxjs";
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class ExpensesGuard implements CanActivate{
  constructor(
    public auth: Auth,
    ){}

    canActivate() : Observable<boolean> | boolean{
      const auth: Auth = getAuth();
      const user = auth.currentUser;
      if(user || localStorage.getItem('access_token')){
        return true
      }
      else{
        return false
      }
    }
}
