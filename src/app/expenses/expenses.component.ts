import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss', '../main-page/main-page.component.scss']
})
export class ExpensesComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }
  isLogginedIn: BehaviorSubject<boolean> = new BehaviorSubject(false)
  ngOnInit(): void {
    this.isLogginedIn = this.authService.isLoggedIn;
  }

  logout() {
    this.authService.logout()
  }
}
