import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { Router } from '@angular/router';
import { MemberProfileComponent } from '../member-profile/member-profile.component';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { MemberService } from 'src/app/Service/member.service';
// import { IMember } from 'src/app/Interface/IMember';
import { User } from '../../Interface/User';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {

  dataTable: any;
  members: User[] = [];

  // tslint:disable-next-line: max-line-length
  constructor(private chRef: ChangeDetectorRef, private route: Router, private http: HttpClient, private memberService: MemberService) { }

  ngOnInit() {
    this.chRef.detectChanges();



    this.memberService.getMembers().subscribe(
      (listMembers) => this.members = listMembers,
    );
    // tslint:disable-next-line:no-unused-expression
    (err) => console.log(err)



    setTimeout(function() {
      const table: any = $('table');
      this.dataTable = table.DataTable({
        bInfo: false,
        bPaginate: false,
      });
    }, 3000);

  }

  viewProfile(uid: string) {
    // this.route.config.find(r => r.component === UpdateProfileComponent).data = id;
    this.route.navigate(['/member-profile', uid]);
    console.log(uid);
  }


}
