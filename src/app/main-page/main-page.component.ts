import { Component, OnInit } from '@angular/core';
import { collection, doc, docData, Firestore, setDoc } from '@angular/fire/firestore';

import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit{
  isLoggedIn: Subject<boolean> = new BehaviorSubject(false);
  passwordPattern = "^(?=.*\d)(?=.*[a-zA-Z]).{8,}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  isLoad: boolean = false;
  errorMessage: BehaviorSubject<string> = new BehaviorSubject(null);

  userForm = this.formBuilder.group({
    "emailUser": new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
    "passwordUser": new FormControl('', [Validators.required])
  })

  constructor(
    public formBuilder: FormBuilder,
    public fireService: Firestore,
    private authService: AuthenticationService,
    ) { }
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.authService.logginState()
  }

  formIsValid(): boolean {
    return (this.userForm.get('emailUser').valid && this.userForm.get('passwordUser').valid)
  }


  singIn() {
    if(this.userForm.valid) {
      this.isLoad = true;
      this.authService.singIn(this.userForm.value.emailUser,this.userForm.value.passwordUser)
        .then(cred =>  {
          if(cred) this.authService.isLoggedIn.next(true);
        })
        .catch(err => {
          if(err.message === "Firebase: Error (auth/wrong-password).") {
            this.errorMessage.next("Wrong password or this email is exist")
            this.isLoad = false;
            this.userForm.reset()

            if(err.message === "Firebase: Error (auth/user-not-found).") {
              this.errorMessage.next("User not found. Please sing up");
            }
          }
        })
    }
  }

  singUp() {
    if(this.userForm.valid) {
      this.isLoad = true;
      this.authService.singUp(this.userForm.value.emailUser,this.userForm.value.passwordUser)
      .then(userCred => {
        if(userCred) this.authService.isLoggedIn.next(true);
      })
      .catch(errMsg => {
        if(errMsg.message === "Firebase: Error (auth/wrong-password).") {
          this.errorMessage.next("Wrong password or this email is exist")
          this.isLoad = false;
          this.userForm.reset()
        }
        if(errMsg.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
          this.errorMessage.next("Password should be at least 6 characters");
        }
      })
      this.isLoad = false
    }
  }

  getErrorEmailMessage() {
      if (this.userForm.controls['emailUser'].hasError('required')) {
        return 'You must enter a value';
      }

      return this.userForm.controls['emailUser'].hasError('pattern') ? 'Not a valid email' : '';
  }

  getErrorPasswordMessage() {
    return this.userForm.controls['passwordUser'].hasError('required') ? 'You must enter a value' : '';
  }
}

