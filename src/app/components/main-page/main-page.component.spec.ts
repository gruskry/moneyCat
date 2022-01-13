import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { MaterialModule } from './../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
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
        logginState(): Observable<boolean> {return of(true)},
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

    it('onInit should call loginState method', () => {
      const serviceLogginStateSpy = spyOn(authService, 'logginState')
      component.ngOnInit()
      expect(serviceLogginStateSpy).toHaveBeenCalled();

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
      fixture.detectChanges();
      const serviceSingInSpy = spyOn(authService, 'singIn').and.callFake(() => {
        return new Promise(resolve => {
          return resolve({user: {emailVerified: true}})
        })
      })
      component.singIn()
      expect(component.userForm.valid).toBeTrue();
      expect(serviceSingInSpy).toHaveBeenCalled();
      authService.singIn('test', 'test').then(cred => {
        expect(cred).toBeDefined()
        expect(cred.user.emailVerified).toBeTrue()
      })
      flush();
    }))

    it('singIn should call authService.singIn with not verified email', fakeAsync(() => {
      spyOn(authService, 'singIn').and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve({user: {emailVerified: false}})
          reject('error')
        })
      })
      const formSpy = spyOn(component.userForm, 'reset')
      const catchSpy = spyOn(authService.singIn('test','test'), 'catch').and.rejectWith('error')
      component.singIn()
      component.userForm.reset()
      authService.singIn('test', 'test').then(cred => {
        expect(cred).toBeDefined()
        expect(cred.user.emailVerified).toBeFalse();
        expect(formSpy.calls.any()).toBeTrue()
      }).catch((err) => {
          expect(err).toBe('error')
          expect(formSpy.calls.any()).toBeTrue()
          expect(catchSpy).toBe('error')
      })
      flush();
    }))

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
  })

  describe('#isValid form', () => {
    it('userForm should be valid', () => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: '123456'
      });
      expect(component.userForm.valid).toBeTrue();
    })

    it('formIsValid should return true', () => {
      spyOn(component, 'formIsValid').and.callFake(() => true)
      expect(component.formIsValid()).toBeTrue()
    })

    it('formIsValid should return false', () => {
      expect(component.formIsValid()).toBeFalse()
    })
    it('formIsValid should return false if password not valid', () => {
      component.userForm.setValue({
        emailUser: 'test@test.ru',
        passwordUser: null
      });
      component.formIsValid()
      expect(component.userForm.get('passwordUser').valid).toBeFalse()
    })
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

    it('getErrorEmailMessage should return "Not a valid email"', () => {
      component.userForm.setValue({
        emailUser: 'test@te',
        passwordUser: '123456'
      });
      fixture.detectChanges()
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
  })
});
