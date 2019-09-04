import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { Router } from '@angular/router';
import { IMember } from '../../Interface/IMember';
import { HttpClient } from '@angular/common/http';
import { MemberService } from '../../Service/member.service';
import { User } from '../../Interface/User';


@Component({
  selector: 'app-admin-team-list',
  templateUrl: './admin-team-list.component.html',
  styleUrls: ['./admin-team-list.component.scss']
})
export class AdminTeamListComponent implements OnInit {

  dataTable: any;

  members: User[] = [];

  constructor(private chRef: ChangeDetectorRef, public route: Router, private http: HttpClient, private memberService: MemberService) { }

  ngOnInit() {
    this.chRef.detectChanges();

    // Now you can use jQuery DataTables :

    setTimeout(function() {
      const table: any = $('table');
      this.dataTable = table.DataTable({
        bInfo: false,
        bPaginate: false,
      });
    }, 3000);

    this.memberService.getMembers().subscribe(
      (listMembers) => this.members = listMembers,
    );
// tslint:disable-next-line: no-unused-expression
    (err) => console.log(err);

  }

  updateProfile(uid: string) {
    // this.route.config.find(r => r.component === UpdateProfileComponent).data = id;
    this.route.navigate(['/update-profile', uid]);
    console.log(uid);
  }
}
