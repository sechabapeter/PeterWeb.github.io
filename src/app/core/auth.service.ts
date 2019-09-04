import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { NotifyService } from './notify.service';
import { User } from '../Interface/User';

import { Observable, of } from 'rxjs';
import { switchMap, concatMap, exhaustMap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;

  //do not initialise the secondary app in app.module.ts but here:
  private config = {

    apiKey: 'AIzaSyAEJA72SuWk2qmmgBnMEru3VGrB2KqGSOQ',
    authDomain: 'projectoverview-6380e.firebaseapp.com',
    databaseURL: 'https://projectoverview-6380e.firebaseio.com',
    projectId: 'projectoverview-6380e',
    storageBucket: 'projectoverview-6380e.appspot.com',
    messagingSenderId: '649002536133',

  };
  private secondaryApp = firebase.initializeApp(this.config, 'secondaryApp');

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private notify: NotifyService) {

    this.user = this.afAuth.authState
      .pipe(switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }));

  }

  //// Email/Password Auth ////

  emailSignUp(email: string, password: string) {
    return this.secondaryApp.auth().createUserWithEmailAndPassword(email, password)
      .then(result => {
        this.resetPasswordInit(email);
        return this.setUserDoc(result.user);
        // console.log(result)
      });
  }

  // Update properties on the user document
  updateUser(user: User, data: any) {
    return this.afs.doc(`users/${user.uid}`).update(data);
  }



  // If error, console log and notify user
  private handleError(error) {
    console.error(error);
    this.notify.update(error.message, 'error');
  }

  updateImage(user: User, imageUrl: any) {
    const data: any = {
      photoURL: imageUrl
    };
    return this.afs.doc(`users/${user.uid}`).update(data);
  }

  // Sets user data to firestore after succesful login
  private setUserDoc(user) {

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email || null,
      photoURL: 'http://wilkinsonschool.org/wp-content/uploads/2018/10/user-default-grey.png',
      firstName: '',
      project: []
    };

    return userRef.set(data);

  }

  resetPasswordInit(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(
      email,
      { url: 'http://localhost:4200/auth' });
    }

}
