import { environment } from './../environments/environment.prod';

import { DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';


import { AppComponent } from './app.component';
import { ExpensesGuard } from './guards/expenses.guard';
import { AuthenticationService } from './services/authentication.service';
import { ExpenseService } from './services/expense.service';
import { FirestoreModule } from '@angular/fire/firestore';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      providers: [AuthenticationService, ExpenseService, DatePipe],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'moneyCat'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('moneyCat');
  });
});
