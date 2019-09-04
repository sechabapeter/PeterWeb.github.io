import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessagingService } from '../messaging.service';
import { Router } from '@angular/router';
import { MemberService } from '../Service/member.service';
import { IMember } from '../Interface/IMember';
import { UserRegister } from '../Interface/userRegister';
import { AngularFireAuth } from '@angular/fire/auth';
// import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  signupForm: FormGroup;
  detailForm: FormGroup;
  randomstring: any;
  user: UserRegister;
  userState;

  constructor(public fb: FormBuilder, public auth: AuthService, private notificationService: MessagingService, public router: Router,
    private memberService: MemberService, private afAuth: AngularFireAuth) { }

  ngOnInit() {

    this.signupForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        this.emailDomain
      ]
      ],
      password: ['']
    });

    this.user = {
      uid: '',
      email: '',
      password: '',
    };

    this.generate();
  }

  //   public save(IsAdmin: boolean, f: Roles) {
  //     console.log(f);
  // }

  // Using getters will make your code look pretty
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }

  MapFormValuesToMemberModel() {
    this.user.email = this.signupForm.value.email;
    this.user.password = this.signupForm.value.password;
  }

  signup() {
    this.router.navigate(['/admin-team-list']);
    this.notify();
    return this.auth.emailSignUp(this.email.value, this.password.value);
  }

  onSubmit(): void {
    this.MapFormValuesToMemberModel();
    this.memberService.addMember(this.user).subscribe(
      () => this.router.navigate(['admin-team-list']),
      (err: any) => console.log(err)
    );
    this.resetPasswordInit(this.user.email);
    this.notify();
  }

  notify() {
    const data: Array<any> = [];
    data.push({
      title: 'Member',
      alertContent: 'New Member was created \n update their profile on list',
    });
    this.notificationService.generateNotification(data);
  }

  back() {
    this.router.navigate(['/admin-team-list']);
  }

  resetPasswordInit(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(
      email,
      { url: 'http://localhost:4200/auth' });
  }

  generate() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    // tslint:disable-next-line:variable-name
    const string_length = 1;
    this.randomstring = Math.random().toString(36).slice(-8);
    for (let i = 0; i < string_length; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      this.randomstring += chars.substring(rnum, rnum + 1);
    }
  }

  emailDomain(control: AbstractControl): { [key: string]: any } | null {
    const email: string = control.value;
    const domain = email.substring(email.lastIndexOf('@') + 1);
    if (email === '' || domain.toLowerCase() === 'accenture.com') {
      return null;
    } else {
      return { emailDomain: true };
    }
  }

}
