import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './components/main-page/main-page.component';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { FirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { AuthenticationService } from './services/authentication.service';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { ExpenseService } from './services/expense.service';
import { ExpensesGuard } from './guards/expenses.guard';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { TotalDialogComponent } from './components/total-dialog/total-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ExpensesComponent,
    TotalDialogComponent,

   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FirestoreModule,
    HttpClientModule,
    MaterialModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    MaterialModule,
  ],
  providers: [AuthenticationService, ExpenseService, DatePipe, ExpensesGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
