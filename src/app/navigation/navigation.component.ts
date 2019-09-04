import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  navbarOpen = false;


  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  constructor(private titleService: Title, public auth: AuthService) { }

  ngOnInit() {
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
