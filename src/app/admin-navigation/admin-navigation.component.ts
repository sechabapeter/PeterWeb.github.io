import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { User } from 'firebase';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.scss']
})
export class AdminNavigationComponent implements OnInit {

  // user: Observable<User>;

  constructor(public auth: AuthService, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
  }

  ngOnInit() {
  }
}
