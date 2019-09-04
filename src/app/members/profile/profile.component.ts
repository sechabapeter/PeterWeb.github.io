import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MemberService } from 'src/app/Service/member.service';
import { AuthService } from '../../core/auth.service';
import { User } from '../../Interface/User';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { MessagingService } from 'src/app/messaging.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Skills } from '../../Interface/Skills';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('sectionNeedToScroll') sectionNeedToScroll: ElementRef;

  // Form groups are serialized as an object
  profileForm: FormGroup;

  validationMessages = {
    cellNumber: {
      required: 'Cellphone number is required.',
      minlength: 'Cellphone number must be 10 digits',
      maxlength: 'Cell Number equals to 10 digits'
    },

  };

  formErros = {
    projectID: '',
    projectName: '',
    clientName: '',
    startDate: '',
    plannedRollOff: '',
    actualRollOff: '',
    projectManager: '',
    cellNumber: '',
    description: ''
  };

  input = true;

  dataTable: any;

  user: Observable<User>;

  isDisabled = true;
  constructor(private chRef: ChangeDetectorRef, private memberService: MemberService, private profileFormBuilder: FormBuilder,
              public auth: AuthService, private router: Router, private notificationService: MessagingService,
              private afAuth: AngularFireAuth, private afs: AngularFirestore) {

    this.user = afAuth.authState;

    this.user.subscribe(
      (user) => {
        if (user) {

          this.afs.collection('users').doc(user.uid).get().subscribe(
            next => {
              const data = next.data();
              console.log(data);
              this.profileForm.patchValue({
                middleName: data.middleName,
                cellNumber: data.cellNumber,
              });
              this.profileForm.setControl('skills', this.setExistingSkills(data.skills));
            }
          );
          // console.log(this.userDetails = user);



        } else {
          // this.userDetails = null;
        }
      }
    );
  }


  ngOnInit() {
    this.chRef.detectChanges();

    this.profileForm = this.profileFormBuilder.group({
      cellNumber: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(11)]],
      middleName: ['', Validators.required],
      skills: this.profileFormBuilder.array([this.addSkillsGroup()])
    });
    this.profileForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.profileForm);
    });
  }

  setExistingSkills(skillSets: Skills[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(p => {
      formArray.push(this.profileFormBuilder.group({
        skillName: p.skillName,
        skillLevel: p.skillLevel,
        lastUsed: p.lastUsed,
        skillOrigin: p.skillOrigin
      }));
    });

    return formArray;
  }

  flip() {
    this.isDisabled = !this.isDisabled;
  }

  edit() {
    this.input = false;
  }

  get skillArray() {
    return this.profileForm.get('skills') as FormArray;
  }

  addSkill() {
    this.skillArray.push(this.addSkillsGroup());
  }

  addSkillsGroup() {
    return this.profileFormBuilder.group({
      skillOrigin: [null, Validators.required],
      lastUsed: [null, Validators.required],
      skillName: [null, Validators.required],
      skillLevel: [null, Validators.required]
    });
  }

  removeSkill(index) {
    this.skillArray.removeAt(index);
  }

  uploadImage(event: any, user: User) {
    const file: File = event.target.files[0];
    const metaData = { contentType: file.type };
    const storageRef: firebase.storage.Reference = firebase.storage().ref('photos/users/' + file.name);
    const uploadTask: firebase.storage.UploadTask = storageRef.put(file, metaData);
    console.log('Uploading: ', file.name);

    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
      const photoURL = downloadURL;
      console.log('URL:' + photoURL);
      console.log('User: ' + user.uid);
      this.auth.updateImage(user, photoURL);
      return photoURL;
    });
  }

  get middleName() { return this.profileForm.get('middleName'); }
  get cellNumber() { return this.profileForm.get('cellNumber'); }

  updateUser(user) {
    this.notify();
    return this.auth.updateUser(user, {
      middleName: this.middleName.value, cellNumber: this.cellNumber.value,
    });

  }

  upadateSkill(user) {
    this.router.navigate(['/profile']);
    return this.auth.updateUser(user, {
      skills: this.skillArray.value
    });

  }

  logValidationErrors(group: FormGroup = this.profileForm): void {
    console.log(Object.keys(group.controls).forEach((key: string) => {
      group.get(key);
      const abstractControl = group.get(key);

      // Check if it's an instance of formGroup. e.g.Skillls would be an instance of form group (Nest form group)
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErros[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          console.log(messages);

          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErros[key] += messages[errorKey] + '';
            }
          }
          // console.log(abstractControl.errors);
        }
      }
    }));
  }

  notify() {
    const data: Array<any> = [];
    data.push({
      title: 'Profile',
      // tslint:disable-next-line:max-line-length
      alertContent: 'Profile Succesfully Updated',
    });
    this.notificationService.generateNotification(data);
  }
}
