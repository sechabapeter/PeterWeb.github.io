import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { error } from 'util';
import { switchMap } from 'rxjs/operators';
import { NotifyService } from 'src/app/core/notify.service';

interface User {
  email: string;
  role?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  currentUserValue: any;

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  constructor(private _firebaseAuth: AngularFireAuth, private router: Router, private notify: NotifyService,
              private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.user = _firebaseAuth.authState;

    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          console.log(this.userDetails);
        } else {
          this.userDetails = null;
        }
      }
    );
  }

  getAuth() {
    return this.afAuth.auth;
  }

  signInRegular(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential( email, password );

    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }


isLoggedIn() {
  if (this.userDetails == null ) {
      return false;
    } else {
      return true;
    }
  }
logout() {
    this._firebaseAuth.auth.signOut()
    .then((res) => this.router.navigate(['/login']));
  }

  forgotPasswordUser(email: any) {
    return this._firebaseAuth.auth.sendPasswordResetEmail(email);
  }

  resetPasswordInit(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(
      email,
      { url: 'http://localhost:4200/auth' });
    }

}









