import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss', '../main-page/main-page.component.scss']
})
export class ExpensesComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    public formBuilder: FormBuilder,
    ) { }

  selected: string = 'Home';
  isLogginedIn: BehaviorSubject<boolean> = new BehaviorSubject(false)
  rows = [];
  expenseForm = this.formBuilder.group({
    "date": new FormControl('', [Validators.required]),
    "title": new FormControl('', [Validators.required]),
    "category": new FormControl('', [Validators.required]),
    "amount": new FormControl('', [Validators.required])
  })

  ngOnInit(): void {
    this.isLogginedIn = this.authService.isLoggedIn;
  }

  logout() {
    this.authService.logout()
  }

  submit() {
    this.expenseForm.value.category = this.selected;
    this.rows.push(this.expenseForm.value);
  }
}
