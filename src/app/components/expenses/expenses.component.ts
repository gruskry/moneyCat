import { CurrencyModel, DbModel } from '../../models/currency.model';
import { map, startWith } from 'rxjs/operators';
import { ExpenseService } from '../../services/expense.service';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TotalDialogComponent } from '../total-dialog/total-dialog.component';

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
  currencies: CurrencyModel[] = this.authService.currencies.value;
  filteredCurrencies: Observable<CurrencyModel[]>;
  filteredCurrenciesChange: Observable<CurrencyModel[]>;
  displayedColumns: string[] = ['title', 'category', 'amount'];
  dataSource = new MatTableDataSource()
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
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private expenseService: ExpenseService,
    private dialog: MatDialog
    ) {}

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.rows = [];
    this.currencies.push({
      Cur_Name: 'Белорусский рубль',
      Cur_Abbreviation: 'BYN',
      Cur_OfficialRate: 1,
      Cur_Scale: 1,
    });
    this.currencies = this.currencies.filter((v,i,a)=>a.findIndex(t=>(t.Cur_Name === v.Cur_Name))===i).sort((a,b) => a.Cur_Name > b.Cur_Name ? 1 : -1);
    this.expenseService.getOptionsDate().then(user => {
      this.isLoad = true
      if (user.exists()) {
        this.rowsWithDefaultCur = user.data().options;
        user.data().options.forEach(el => {
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
    this.filteredCurrencies = this.expenseForm.get('currency')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    )
    this.filteredCurrenciesChange = this.expenseForm.get('currencyChange').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
    this.isLoad = false;
  }

  private _filter(value: string): CurrencyModel[] {

    const filterValue = this._normalizeValue(value);
    return this.currencies.filter(currency => this._normalizeValue(currency.Cur_Name + currency.Cur_Abbreviation).includes(filterValue));
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
    this.expenseService.chosenDate.next(dateReqFormat)
    this.expenseService.getOptionsDate().then(user => {
      if (user.exists()) {
        if (user.data().options) {
          this.rowsWithDefaultCur = user.data().options;
          user.data().options.forEach(el => {
            if(el.date === chosenDate)  {
              this.rows.push(el);
              this.dataSource = new MatTableDataSource(this.rows);
              setTimeout(() => {
                this.dataSource.sort = this.sort;
              });
            }
          });
        }
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
    this.dataSource = new MatTableDataSource(this.rows);
    this.rows.map((currency) => {
      this.currencies.forEach(typeCur => {
        let fullNameCurrency = `${typeCur.Cur_Name} (${typeCur.Cur_Abbreviation})`
        if(fullNameCurrency.includes(currency.currency)) {
          let changeToByn: number;
          changeToByn = ((currency.amount * typeCur.Cur_OfficialRate) / typeCur.Cur_Scale);
          currency.amount = Math.round(((changeToByn / selectedCurrency.Cur_OfficialRate) * selectedCurrency.Cur_Scale));
          currency.currency = `${selectedCurrency.Cur_Name} (${selectedCurrency.Cur_Abbreviation})`;
        }
      })

    })
  }

  resetCurrencies() {
    this.expenseService.getOptionsDate().then(user => {
      this.rows = []
      this.isLoad = true
      if (user.exists()) {
        this.rowsWithDefaultCur = user.data().options
        console.log(this.rowsWithDefaultCur)
        user.data().options.forEach(el => {
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

  openDialog() {
    this.dialog.open(TotalDialogComponent);
  }
}

