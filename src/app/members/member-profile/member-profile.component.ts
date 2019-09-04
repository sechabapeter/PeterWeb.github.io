import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMember } from '../../Interface/IMember';
import { MemberService } from '../../Service/member.service';
import { User } from '../../Interface/User';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss']
})
export class MemberProfileComponent implements OnInit {

  member: User;

  constructor(private route: ActivatedRoute, private memberService: MemberService) {

  }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const memberID = params.get('id');
      {
        this.getMember(memberID);
      }

    });
  }

  getMember(id: string) {
    this.memberService.getMember(id).subscribe(
      (member: User) => {
        this.member = member;
        console.log(this.member);
      },
      (err: any) => console.log(err)
    );
  }

}
