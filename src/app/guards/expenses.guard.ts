import { AuthenticationService } from './../services/authentication.service';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable, of, Subject} from "rxjs";
import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { first, shareReplay } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ExpensesGuard implements CanActivate{
  constructor(
    private authService: AuthenticationService,
    public auth: Auth,
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean{
      let userState = new Subject<boolean>();
      this.authService.logginState().subscribe(currentState => {
        userState.next(currentState)
      })
      return userState.asObservable();
    }
}
