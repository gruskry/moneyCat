import { Auth } from "@angular/fire/auth";
import { ExpensesGuard } from "./expenses.guard";

describe('Expenses Guard', () => {
  let guard: ExpensesGuard;
  let authService;
  let auth: Auth;
  describe('canActivate', () => {
    xit('should return for a logged user', () => {
      guard = new ExpensesGuard(auth);

      expect(guard.canActivate()).toEqual(true)
    })
  })
});



