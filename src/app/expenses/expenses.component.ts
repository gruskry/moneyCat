import { ExpenseService } from './../services/expense.service';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss', '../main-page/main-page.component.scss'],
  providers: [DatePipe]
})
export class ExpensesComponent implements OnInit {
  dateNow = new Date();
  currentDate: string = this.datePipe.transform(this.dateNow,"dd/MM/yyyy");
  selected: string = 'Home';
  isLogginedIn: BehaviorSubject<boolean> = new BehaviorSubject(false)
  rows = [];
  isLoad: boolean = false;


  expenseForm = this.formBuilder.group({
    "date": new FormControl(this.dateNow, [Validators.required]),
    "title": new FormControl('', [Validators.required]),
    "category": new FormControl('Home', [Validators.required]),
    "amount": new FormControl('', [Validators.required])
  })


  constructor(
    private authService: AuthenticationService,
    public formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private expenseService: ExpenseService,
    ) { }

  ngOnInit(): void {
    this.isLogginedIn = this.authService.isLoggedIn;
    this.rows = [];

    this.expenseService.getOptions().then(user => {
      this.isLoad = true
      if (user.exists()) {
        user.data().options.forEach(el => {
          if(el.date === this.currentDate) this.rows.push(el);
        });
      } else {
         this.rows = [];
      }
      this.isLoad = false;
    })
  }

  logout() {
    this.authService.logout()
  }

  submit() {
    if(this.expenseForm.valid) {
      this.expenseForm.value.category = this.selected;
      this.expenseForm.value.date = this.datePipe.transform(this.expenseForm.value.date, 'dd/MM/yyyy')
      this.rows.push(this.expenseForm.value);
      this.expenseService.setOptions(this.rows);
    }
  }

  changeDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.rows = [];
    this.isLoad = true;
    let chosenDate = this.datePipe.transform(event.value,"dd/MM/yyyy");
    let dateReqFormat = this.datePipe.transform(event.value, 'MMddyyyy');
    this.expenseService.chosenDate.next(dateReqFormat)
    this.expenseService.getOptions().then(user => {
      if (user.exists()) {
        if (user.data().options) {
          user.data().options.forEach(el => {
            if(el.date === chosenDate) this.rows.push(el);
          });
        }
      } else {
         this.rows = [];
      }
      this.isLoad = false;
    })
  }

  getErrorMessage() {
    return (this.expenseForm.controls['date'].hasError('required')
    || this.expenseForm.controls['title'].hasError('required')
    || this.expenseForm.controls['category'].hasError('required')
    || this.expenseForm.controls['amount'].hasError('required'))
    ? 'You must enter a value'
    : ''
  }
}
