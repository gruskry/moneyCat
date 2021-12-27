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
  constructor(private authService: AuthenticationService) { }
  isLogginedIn: BehaviorSubject<boolean> = new BehaviorSubject(false)
  ngOnInit(): void {
    this.isLogginedIn = this.authService.isLoggedIn;
  }
}
