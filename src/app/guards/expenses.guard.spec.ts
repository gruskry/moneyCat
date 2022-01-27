import { ExpensesGuard } from "./expenses.guard";
import { Auth, getAuth, User } from "@angular/fire/auth";
import { inject, TestBed } from "@angular/core/testing";


describe('Expenses Guard', () => {
  let auth: Auth;
  let guard: ExpensesGuard;
  let mockAuth = {
    currentUser: {emailVerified: 'test'}
  }
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [ExpensesGuard, {provide: Auth, useValue: mockAuth}],
    });
    guard = TestBed.inject(ExpensesGuard)
  });

  describe('canActivate', () => {
    it('should return false as user not login', () => {
      mockAuth.currentUser.emailVerified = ''
      guard.canActivate()
      expect(guard.canActivate()).toBeFalse();
    })

    it('should return true as user logged', () => {
      localStorage.setItem('access_token','asd');
      guard.canActivate()
      expect(guard.canActivate()).toBeTrue()
    })
    afterEach(() => localStorage.clear());
  })
});



