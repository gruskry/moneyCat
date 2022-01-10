import { CurrencyModel } from './../models/currency.model';
import { map, startWith } from 'rxjs/operators';
import { ExpenseService } from './../services/expense.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
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
  currentExchangeCurrency: string;
  currentExchangeAmount: number;
  selected: string = 'Home';
  exchangeRate: number;
  defaultCurrency: string = 'Albanian Lek (ALL)';
  rows = [];
  isLoad: boolean = false;
  targetClassList = [];
  index: number = 0;
  currencies: CurrencyModel[] = this.authService.currencies.value;
  filteredCurrencies: Observable<CurrencyModel[]>;
  filteredCurrenciesChange: Observable<CurrencyModel[]>;
  expenseForm = this.formBuilder.group({
    "date": new FormControl(this.dateNow, [Validators.required]),
    "title": new FormControl('', [Validators.required]),
    "category": new FormControl('Home', [Validators.required]),
    "amount": new FormControl('', [Validators.required]),
    'currency': new FormControl('', [Validators.required]),
    'currencyChange': new FormControl(''),
  })

  constructor(
    private authService: AuthenticationService,
    public formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private expenseService: ExpenseService,
    ) {}

  ngOnInit(): void {
    this.rows = [];
    this.currencies = this.currencies.filter((v,i,a)=>a.findIndex(t=>(t.Cur_Name === v.Cur_Name))===i);
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
    this.filteredCurrencies = this.expenseForm.get('currency')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    )
    this.filteredCurrenciesChange = this.expenseForm.get('currencyChange').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )

  }
  private _filter(value: string): CurrencyModel[] {

    const filterValue = this._normalizeValue(value);
    return this.currencies.filter(currency => this._normalizeValue(currency.Cur_Name_Eng + currency.Cur_Abbreviation).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
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

  checkSelectedCurrency(selectedCurrency: string, currentAmount: number) {
    this.expenseService.getExchangeRates(this.currentExchangeCurrency, selectedCurrency).subscribe((data) => {
     this.exchangeRate = (data[`${this.currentExchangeCurrency}_${selectedCurrency}`]*this.currentExchangeAmount);
    })
  }

  checkCurrentCurrency(currentCurrency: string, currentAmount: number, event) {

    this.targetClassList.push(event.target.className);
    if(this.index === 0) {
      this.currentExchangeAmount = currentAmount;
      this.currentExchangeCurrency = currentCurrency.slice(-4,-1);
    } else if (!(this.targetClassList[this.index-1] === event.target.className)) {
      this.currentExchangeAmount = currentAmount;
      this.currentExchangeCurrency = currentCurrency.slice(-4,-1);
    }
    this.index++;
  }
}

