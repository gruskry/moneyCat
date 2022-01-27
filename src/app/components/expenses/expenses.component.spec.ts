import { DatePipe } from '@angular/common';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { CurrencyModel } from './../../models/currency.model';
import { ExpenseService } from './../../services/expense.service';
import { MaterialModule } from './../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from "@angular/core/testing";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExpensesComponent } from '../expenses/expenses.component';
import { map } from 'rxjs/operators';


describe('ExpensesComponent', () => {
  let component: ExpensesComponent;
  let fixture: ComponentFixture<ExpensesComponent>;
  let datePipe: DatePipe;
  let dateNow = new Date();
  let mockCurrencies: any = [
    {
      Cur_Abbreviation: 'TEST',
      Cur_Name: 'testName',
    }
  ]

  let mockOptions = {
    exists() { return true },
    data() {
      return {
        options : [
          {
            date: datePipe.transform(dateNow, 'MM/dd/yyyy'),
            amount: 22500,
            category: "testCategory",
            currency: "testCurrency",
            currencyChange: "",
            title:'test'
        }
        ] as any
      }
    }
  }
  let authService: AuthenticationService;
  let expenseService: ExpenseService;
  let mockAuthService = { logout() {}}
  let mockExpenseService = {
    getCurrencies() { return of(mockCurrencies)},
    getOptionsDate() { return Promise.resolve(mockOptions)},
    setOptions(options) {return options},
    chosenDate: new BehaviorSubject(null),
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide : AuthenticationService, useValue: mockAuthService},
        { provide: ExpenseService, useValue: mockExpenseService},
        DatePipe,
      ],
      declarations: [ExpensesComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    expenseService = TestBed.inject(ExpenseService)
    datePipe = TestBed.inject(DatePipe)
    fixture.detectChanges();
  })

  describe('#onInit', () => {
    it('onInit should called', () => {
      const onInit = spyOn(component, 'ngOnInit')
      component.ngOnInit()
      expect(onInit).toHaveBeenCalled()
    })

    it('getOptionsDate should return resolve data', fakeAsync(() => {
      expenseService.getOptionsDate().then(user => {
        expect(user.data().options).toEqual(mockOptions.data().options)
      })
      flush();
    }))
    it('getOptionsDate should return resolve data with doesn`t exists user', fakeAsync(() => {
      mockOptions.exists = function() {return false}
      expenseService.getOptionsDate().then(user => {
        expect(component.rows.length).toBe(0)
      })
      flush()
    }))
    it('expenseForm get currency and call updateCurrenciesSpy', fakeAsync(() => {
      const updateCurrenciesSpy = spyOn(component, 'updateCurrentCurrencies');
      component.expenseForm.controls['currency'].setValue('test');
      component.expenseForm.get('currency')!.valueChanges.subscribe((value) => {
        expect(updateCurrenciesSpy).toHaveBeenCalledWith(value)
      })
      expect(updateCurrenciesSpy).toHaveBeenCalled()
      flush()
    }))

  })
  describe('#functions and statements', () => {
    it('updateCurrentCurrensies should return filtered array',fakeAsync(() => {
      component.updateCurrentCurrencies('BYN').subscribe((value)=>{
        expect(value.length).toBeGreaterThan(0);
        flush()
      })
    }))

    it('logout should call authService.logout()', () => {
      const logoutSpy = spyOn(mockAuthService, 'logout');
      component.logout();
      expect(logoutSpy).toHaveBeenCalled()
    })

    it('submit method should set options', () => {
      component.expenseForm.setValue({
        date: dateNow,
        title: 'testTitle',
        category: 'testCategory',
        amount: 'testAmount',
        currency: 20000,
        currencyChange: '',
        rateToByn: 'testRateToByn',
      })
      const setOptionsSpy = spyOn(mockExpenseService,'setOptions');
      const rowsSpy = spyOn(component.rows, 'push');
      const rowsWithDefaultCurSpy = spyOn(component.rowsWithDefaultCur, 'push');
      const resetCurrenciesSpy = spyOn(component, 'resetCurrencies');
      component.submit()
      expect(resetCurrenciesSpy).toHaveBeenCalled()
      expect(rowsSpy).toHaveBeenCalledWith(component.expenseForm.value)
      expect(rowsWithDefaultCurSpy).toHaveBeenCalledWith(component.expenseForm.value)
      expect(setOptionsSpy).toHaveBeenCalledWith(component.rowsWithDefaultCur)
    })

    it('changeDate should set data in array', fakeAsync(() => {
      const chosenDateSpy = spyOn(mockExpenseService.chosenDate, 'next')
      let event: any = {value: dateNow}
      let dateReqFormat = datePipe.transform(event.value, 'MMddyyyy');
      mockOptions.exists = function() {return true};
      component.changeDate(event)

      expect(chosenDateSpy).toHaveBeenCalledWith(dateReqFormat)
      expenseService.getOptionsDate().then(user => {
        expect(component.rowsWithDefaultCur).toEqual(user.data().options)
      })
      flush();
    }))

    it('changeDate should return resolve data with doesn`t exists user', fakeAsync(() => {
      mockOptions.exists = function() {return false}
      let event: any = {value: dateNow}
      component.changeDate(event)
      expenseService.getOptionsDate().then(user => {
        expect(component.rows.length).toBe(0)
      })
      flush()
    }))

    it('checkSelectedCurrency should change rows', () => {
      const selectedCurrency: any = {
        Cur_Abbreviation: "DKK",
        Cur_ID: 450,
        Cur_Name: "Датских крон",
        Cur_OfficialRate: 3.9705,
        Cur_Scale: 10,
        Date: "2022-01-26T00:00:00",
      }
      component.rows.push({
        currency: {
          Cur_Name: 'Белорусский рубль',
          Cur_Abbreviation: 'BYN',
          Cur_OfficialRate: 1,
          Cur_Scale: 1,
        }
      });
      component.checkSelectedCurrency(selectedCurrency);
      component.rows.map(currency => {
        expect(currency.currency.Cur_Abbreviation).toEqual(selectedCurrency.Cur_Abbreviation)
      })
    })
    afterEach(() => component.rows = [])

    it('resetCurrency should reset rows to default currency value', fakeAsync(() => {
      mockOptions.exists = function() {return true};
      component.resetCurrencies()
      expenseService.getOptionsDate().then(user => {
        expect(component.rowsWithDefaultCur).toEqual(user.data().options)
      })
      flush();
    }))

    it('resetCurrency should reset rows if user doesn`t exist', fakeAsync(() => {
      mockOptions.exists = function() {return false}
      component.resetCurrencies()
      expenseService.getOptionsDate().then(user => {
        expect(component.rows.length).toBe(0)
      })
      flush()
    }))
  })

});
