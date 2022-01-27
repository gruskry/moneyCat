import { MainPageComponent } from './components/main-page/main-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { ExpensesGuard } from './guards/expenses.guard';

const routes: Routes = [
  { path: 'home', component: MainPageComponent, },
  { path: 'expenses', component: ExpensesComponent, canActivate: [ExpensesGuard], pathMatch: 'full' },
  { path: '**', redirectTo:'home',},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
