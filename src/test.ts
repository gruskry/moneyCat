import { getFirestore } from '@angular/fire/firestore';
// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import {initializeApp} from 'firebase/app'
import {getAnalytics} from "firebase/analytics";
import {getDatabase} from "firebase/database";
import {getAuth} from "firebase/auth";

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// export const testEnvironment = {
//   production: false,
//   useEmulators: true,
//   firebaseConfig: {
//     projectId: 'moneycat-2e352',
//     appId: '1:1011558678495:web:801a80f6ccba56d1c74e6a',
//     storageBucket: 'moneycat-2e352.appspot.com',
//     apiKey: 'AIzaSyBtjCeqBAG4kc9MvRF61koWTgcQf-pgJTs',
//     authDomain: 'moneycat-2e352.firebaseapp.com',
//     messagingSenderId: '1011558678495',
//   }
// };

// export const app = initializeApp(testEnvironment.firebaseConfig);
// export const analytics = getAnalytics(app);
// export const database = getDatabase(app);
// export const auth = getAuth(app);
// export const firestore = getFirestore(app);

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
