import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { MaterialModule } from './../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, fakeAsync, flush, TestBed } from "@angular/core/testing";
import { MainPageComponent } from "./main-page.component";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let authService: AuthenticationService;
  let _snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule],
      providers: [{provide: AuthenticationService, useValue: {
        singIn(): Promise<any> {return Promise.resolve('user')},
        singUp(): Promise<any> {return Promise.resolve('user')}
      }}],
      declarations: [MainPageComponent]
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthenticationService);
    fixture.detectChanges();
  })

  describe('#onInit', () => {
    it('onInit should called', () => {
      const onInit = spyOn(component, 'ngOnInit')
      component.ngOnInit()
      expect(onInit).toHaveBeenCalled()
    })

  })
  describe('#auth', () => {
    it('singIn should called', () => {
      const singIn = spyOn(component, 'singIn');
      component.singIn()
      expect(singIn).toHaveBeenCalled();
    })

    it('singIn should call authService.singIn with verified email', fakeAsync(() => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123456'
      });
      const serviceSingInSpy = spyOn(authService, 'singIn').and.returnValue(Promise.resolve({user: {emailVerified: true}}))
      component.singIn()
      authService.singIn('test','test').then(cred => {
        expect(cred).toBeTruthy();
        expect(cred.user.emailVerified).toBeTruthy();
      })
      expect(component.userForm.valid).toBeTrue();
      expect(serviceSingInSpy).toHaveBeenCalled();
      flush();
    }))

    it('singIn should call authService.singIn and return user with not verified email', fakeAsync(() => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123456'
      });
      spyOn(authService, 'singIn').and.returnValue(Promise.resolve({user: {emailVerified: false}}));
      const formSpy = spyOn(component.userForm, 'reset').and.callThrough()
      component.singIn();
      expect(component.userForm.valid).toBeTrue()
      authService.singIn('test', 'test').then((cred) => {
        expect(cred).not.toBeFalsy()
        expect(cred.user.emailVerified).toBeFalse();
        expect(formSpy).toHaveBeenCalled()
      });
      flush();
    }))


    it('singIn should call authService.singIn and catch password error', fakeAsync(() => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123456'
      });
      spyOn(authService, 'singIn').and.returnValue(Promise.reject({message: 'Firebase: Error (auth/wrong-password).'}));

      component.singIn();
      authService.singIn('test', 'test').catch((err) => {
        expect(err).toBeDefined()
        expect(err.message).toBe('Firebase: Error (auth/wrong-password).');
      })
    }));

    it('singIn should call authService.singIn and catch user-not-found error', fakeAsync(() => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123456'
      });
      spyOn(authService, 'singIn').and.returnValue(Promise.reject({message: 'Firebase: Error (auth/user-not-found).'}));
      component.singIn();
      authService.singIn('test', 'test').then(cred => {
        expect(cred).toEqual(false)
      })
      .catch((err) => {
        expect(err).toBeDefined()
        expect(err.message).toBe('Firebase: Error (auth/user-not-found).');
      })
    }));

    it('singIn should to coverage else branch', fakeAsync(() => {
      component.userForm.setValue({
        emailUser: '',
        passwordUser: ''
      });
      component.singIn();
      expect(false).toEqual(false)
    }));


    it('singUp should called', () => {
      const singUp = spyOn(component, 'singUp');
      component.singUp()
      expect(singUp).toHaveBeenCalledWith();
    })

    it('singUp should call authService.singUp', fakeAsync(() => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123456'
      });
      fixture.detectChanges();
      const serviceSingUpSpy = spyOn(authService, 'singUp').and.callFake(() => Promise.resolve('user'))
      component.singUp()
      expect(serviceSingUpSpy).toHaveBeenCalled();
      flush();
    }))

    it('singUp should call authService.singUp with verified email', fakeAsync(() => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123456'
      });
      const servicesingUpSpy = spyOn(authService, 'singUp').and.returnValue(Promise.resolve({user: {emailVerified: true}}))
      component.singUp()
      authService.singUp('test','test').then(cred => {
        expect(cred).toBeTruthy();
        expect(cred.user.emailVerified).toBeTruthy();
      })
      expect(component.userForm.valid).toBeTrue();
      expect(servicesingUpSpy).toHaveBeenCalled();
      flush();
    }))


    it('singUp should call authService.singUp and return user with not verified email', fakeAsync(() => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123456'
      });
      spyOn(authService, 'singUp').and.returnValue(Promise.resolve({user: {emailVerified: false}}));
      component.singUp();
      expect(component.userForm.valid).toBeTrue()
      authService.singUp('test', 'test').then((cred) => {
        expect(cred).not.toBeFalsy()
        expect(cred.user.emailVerified).toEqual(false);
      });
      flush();
    }))

    it('singUp should to coverage else branch', fakeAsync(() => {
      component.userForm.setValue({
        emailUser: '',
        passwordUser: ''
      });
      component.singUp();
      expect(false).toEqual(false)
    }));

    it('singUp should call authService.singUp and catch password error', fakeAsync(() => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123456'
      });
      spyOn(authService, 'singUp').and.returnValue(Promise.reject({message: 'Firebase: Error (auth/wrong-password).'}));
      component.singUp();
      authService.singUp('test', 'test').catch((err) => {
        expect(err).toBeDefined()
        expect(err.message).toBe('Firebase: Error (auth/wrong-password).');
      })
    }));

    it('singUp should call authService.singUp and catch email error', fakeAsync(() => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123456'
      });
      spyOn(authService, 'singUp').and.returnValue(Promise.reject({message: 'Firebase: Error (auth/email-already-in-use).'}));
      component.singUp();
      authService.singUp('test', 'test').catch((err) => {
        expect(err).toBeDefined()
        expect(err.message).toBe('Firebase: Error (auth/email-already-in-use).');
      })
    }));

    it('singUp should call authService.singUp and catch password validator error', fakeAsync(() => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123'
      });
      spyOn(authService, 'singUp').and.returnValue(Promise.reject({message: 'Firebase: Password should be at least 6 characters (auth/weak-password).'}));
      component.singUp();
      authService.singUp('test', 'test').catch((err) => {
        expect(err).toBeDefined()
        expect(err.message).toBe('Firebase: Password should be at least 6 characters (auth/weak-password).');
      })
    }));


  })



  describe('#errorMessages', () => {
    it('getErrorEmailMessage should called', () => {
      const emailErrorMessage = spyOn(component, 'getErrorEmailMessage')
      component.getErrorEmailMessage();
      expect(emailErrorMessage).toHaveBeenCalled()
    })

    it('getErrorEmailMessage should return "error"', () => {
      spyOn(component, 'getErrorEmailMessage').and.callFake(() => 'error')
      component.getErrorEmailMessage();
      expect(component.getErrorEmailMessage()).toBe('error')
    })

    it('getErrorEmailMessage should return "You must enter a value"', () => {
      component.getErrorEmailMessage();
      expect(component.getErrorEmailMessage()).toBe('You must enter a value')
    })

    it('getErrorEmailMessage should return ""', () => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123456'
      });
      component.getErrorEmailMessage();
      expect(component.getErrorEmailMessage()).toBe('')
    })

    it('getErrorEmailMessage should return "Not a valid email"', () => {
      component.userForm.setValue({
        emailUser: 'test@te',
        passwordUser: '123456'
      });
      component.getErrorEmailMessage();
      expect(component.getErrorEmailMessage()).toBe('Not a valid email')
    })

    it('getErrorPasswordMessage should called', () => {
      const passwordErrorMessage = spyOn(component, 'getErrorPasswordMessage')
      component.getErrorPasswordMessage();
      expect(passwordErrorMessage).toHaveBeenCalled()
    })

    it('getErrorPasswordMessage should return "You must enter a value"', () => {
      component.getErrorPasswordMessage();
      expect(component.getErrorPasswordMessage()).toBe('You must enter a value')
    })

    it('getErrorPasswordMessage should return ""', () => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123456'
      });
      component.getErrorPasswordMessage();
      expect(component.getErrorPasswordMessage()).toBe('')
    })
  })
});
