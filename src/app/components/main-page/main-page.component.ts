import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { sendEmailVerification } from '@angular/fire/auth';

import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit{
  passwordPattern = "^(?=.*\d)(?=.*[a-zA-Z]).{8,}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  isLoad: boolean = false;
  errorMessage: BehaviorSubject<string> = new BehaviorSubject(null);

  userForm = this.formBuilder.group({
    "emailUser": new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
    "passwordUser": new FormControl('', [Validators.required])
  })

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private router: Router,
    ) { }
  ngOnInit(): void {
    if(localStorage.getItem('access_token')) this.router.navigate(['/expenses']);
  }

  singIn() {
    if(this.userForm.valid) {
      this.isLoad = true;
      this.authService.singIn(this.userForm.value.emailUser,this.userForm.value.passwordUser)
        .then(cred =>  {
          this.authService.setTokens(cred);
          if (!cred.user.emailVerified) {
            this._snackBar.open('Please verify your email address', 'OK', {duration: 5000})
            this.userForm.reset();
          }
        })
        .catch(err => {
          if(err.message === "Firebase: Error (auth/wrong-password).") {
            this.errorMessage.next("Wrong password or this email is exist")
            this.isLoad = false;
            this.userForm.reset()
          }
          if(err.message === "Firebase: Error (auth/user-not-found).") {
            this.errorMessage.next("User not found. Please sing up");
            this.isLoad = false;
            this.userForm.reset()
          }
        })
      this.isLoad = false
    }
  }

  singUp() {
    if(this.userForm.valid) {
      this.isLoad = true;
      this.authService.singUp(this.userForm.value.emailUser,this.userForm.value.passwordUser)
      .then(userCred => {
        if (!userCred.user.emailVerified) {
          this._snackBar.open('Please verify your email and sing In', 'OK', {duration: 5000})
          this.userForm.reset();
          sendEmailVerification(userCred.user);
        }
      })
      .catch(errMsg => {
        if(errMsg.message === "Firebase: Error (auth/wrong-password).") {
          this.errorMessage.next("Wrong password or this email is exist")
          this.isLoad = false;
          this.userForm.reset()
        }
        if(errMsg.message === 'Firebase: Error (auth/email-already-in-use).') {
          this.errorMessage.next('Email already in use');
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

  getErrorEmailMessage(): string {
      if (this.userForm.controls['emailUser'].hasError('required')) {
        return 'You must enter a value';
      }

      return this.userForm.controls['emailUser'].hasError('pattern') ? 'Not a valid email' : '';
  }

  getErrorPasswordMessage(): string {
    return this.userForm.controls['passwordUser'].hasError('required') ? 'You must enter a value' : '';
  }
}

