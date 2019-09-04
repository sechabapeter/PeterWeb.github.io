import { Component } from '@angular/core';

import { OnInit, EventEmitter, Output} from '@angular/core';
import {MessagingService} from './messaging.service';

import {AngularFireModule} from '@angular/fire';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  private titles = 'Browser Push Notifications!';

  constructor(private notificationService: MessagingService) {
    this.notificationService.requestPermission();
}

  // titles = 'Team Portal';
  // visible = false;
  // invisible = false;

  ngOnInit() {}

  // toggleDiv() {
  //   this.visible = !this.visible;
  //   this.toggleDiv_ = this.toggleDiv_;

  // }

  // toggleDiv_() {
  //   this.invisible = this.invisible;
  // }
}
