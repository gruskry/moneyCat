import { CurrencyModel } from './../../models/currency.model';
import { map} from 'rxjs/operators';
import { ExpenseService } from '../../services/expense.service';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss', '../main-page/main-page.component.scss'],
  providers: [DatePipe]
})

export class ExpensesComponent implements OnInit {
  dateNow = new Date();
  currentDate: string = this.datePipe.transform(this.dateNow,"MM/dd/yyyy");
  currentExchangeCurrency: string;
  currentExchangeAmount: number;
  selected: string = 'Home';
  exchangeRate: number;
  rows = [];
  rowsWithDefaultCur = []
  isLoad: boolean = false;
  currencies: Observable<CurrencyModel[]>;
  filteredCurrencies: Observable<CurrencyModel[]>;
  filteredCurrenciesChange: Observable<CurrencyModel[]>;
  displayedColumns: string[] = ['title', 'category', 'amount'];
  dataSource = new MatTableDataSource()
  expenseForm = this.formBuilder.group({
    "date": new FormControl(this.dateNow, [Validators.required]),
    "title": new FormControl('', [Validators.required]),
    "category": new FormControl('Home', [Validators.required]),
    "amount": new FormControl('', [Validators.required]),
    'currency': new FormControl(null, [Validators.required]),
    'currencyChange': new FormControl(''),
    'rateToByn': new FormControl(null),
  })

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private expenseService: ExpenseService,
    ) {}

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.rows = [];
    this.currencies = this.expenseService.getCurrencies();
    this.filteredCurrencies = this.currencies;
    this.filteredCurrenciesChange = this.currencies;
    this.expenseService.getOptionsDate().then(user => {
      this.isLoad = true
      if (user.exists()) {
        this.rowsWithDefaultCur = user.data().options;
        user.data().options.forEach(el => {
          /* istanbul ignore else */
          if(el.date === this.currentDate) {
            this.rows.push(el);
            this.dataSource = new MatTableDataSource(this.rows);
            setTimeout(() => {
              this.dataSource.sort = this.sort;
            });
            this.isLoad = false;
          };
        });
      } else {
         this.rows = [];
         this.isLoad = false;
      }
      this.isLoad = false;
    })

    this.expenseForm.get('currency')!.valueChanges.subscribe(value => {
      this.filteredCurrencies = this.updateCurrentCurrencies(value)
    })

    this.expenseForm.get('currencyChange').valueChanges.subscribe(value => {
      this.filteredCurrenciesChange = this.updateCurrentCurrencies(value);
    })

    this.isLoad = false;
  }

  updateCurrentCurrencies(value): Observable<CurrencyModel[]> {
    return this.currencies.pipe(
      map((currency: CurrencyModel[]) => {
        currency.push({
          Cur_Name: 'Белорусский рубль',
          Cur_Abbreviation: 'BYN',
          Cur_OfficialRate: 1,
          Cur_Scale: 1,
        })
        return currency.filter((currencyItem: CurrencyModel)=> {
          const filterValue = this._normalizeValue(value)
          console.log(this._normalizeValue(`${currencyItem.Cur_Name} (${currencyItem.Cur_Abbreviation})`).includes(filterValue))
          return this._normalizeValue(`${currencyItem.Cur_Name} (${currencyItem.Cur_Abbreviation})`).includes(filterValue)
        })
      })
    )
  }

  displayCurrencyName(currency?: CurrencyModel) {
    return currency ? `${currency.Cur_Name} (${currency.Cur_Abbreviation})`: null;
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  logout() {
    this.authService.logout()
  }

  submit() {
    /* istanbul ignore else */
    if(this.expenseForm.valid) {
      this.expenseForm.value.category = this.selected;
      this.expenseForm.value.date = this.datePipe.transform(this.expenseForm.value.date, 'MM/dd/yyyy')
      this.rowsWithDefaultCur.push(this.expenseForm.value)
      this.rows.push(this.expenseForm.value);
      this.dataSource = new MatTableDataSource(this.rowsWithDefaultCur);
      this.resetCurrencies();
      this.expenseService.setOptions(this.rowsWithDefaultCur);
    }
  }

  changeDate(event: MatDatepickerInputEvent<Date>) {
    this.rows = [];
    this.isLoad = true;
    let chosenDate = this.datePipe.transform(event.value,"MM/dd/yyyy");
    let dateReqFormat = this.datePipe.transform(event.value, 'MMddyyyy');
    this.currentDate = chosenDate;
    this.expenseService.chosenDate.next(dateReqFormat)
    this.expenseService.getOptionsDate().then(user => {
      if (user.exists()) {
        this.rowsWithDefaultCur = user.data().options;
        user.data().options.forEach(el => {
          /* istanbul ignore else */
          if(el.date === chosenDate)  {
            this.rows.push(el);
            this.dataSource = new MatTableDataSource(this.rows);
            setTimeout(() => {
              this.dataSource.sort = this.sort;
            });
          }
        });
      } else {
         this.rows = [];
         this.dataSource = new MatTableDataSource(this.rows)
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

  checkSelectedCurrency(selectedCurrency) {
    this.filteredCurrenciesChange = this.currencies
    this.dataSource = new MatTableDataSource(this.rows);
    this.rows = this.rows.map((item) => {
      item.amount = ((item.amount * item.currency.Cur_OfficialRate) / selectedCurrency.Cur_OfficialRate).toFixed(2)
      item.currency.Cur_Name = selectedCurrency.Cur_Name;
      item.currency.Cur_Abbreviation = selectedCurrency.Cur_Abbreviation
      return item;
    })
  }

  resetCurrencies() {
    this.expenseService.getOptionsDate().then(user => {
      this.rows = []
      this.isLoad = true
      if (user.exists()) {
        this.rowsWithDefaultCur = user.data().options
        user.data().options.forEach(el => {
          /* istanbul ignore else */
          if(el.date === this.currentDate) {
            this.rows.push(el);
            this.dataSource = new MatTableDataSource(this.rowsWithDefaultCur);
          };
        });
      } else {
         this.rows = [];
      }
      this.isLoad = false;
    });
  }
}

