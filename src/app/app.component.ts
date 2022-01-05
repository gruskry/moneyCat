import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'moneyCat';
  isLogginedIn: BehaviorSubject<boolean> = new BehaviorSubject(false)
  isMainPage: BehaviorSubject<boolean> = new BehaviorSubject(false)
  constructor(private authService: AuthenticationService) {
    this.authService.logginState();
    this.isMainPage =  this.authService.isMainPage;
    this.isLogginedIn = this.authService.isLoggedIn;
  }

  ngOnInit(): void {

  }
}
