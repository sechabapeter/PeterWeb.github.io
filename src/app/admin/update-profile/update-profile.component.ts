import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MemberService } from '../../Service/member.service';
import { IMember } from '../../Interface/IMember';
import { User } from '../../Interface/User';
import { ProjectService } from 'src/app/Service/projects.service';
import { IProject } from 'src/app/Interface/IProject';
import { AngularDelegate } from '@ionic/angular';
import { MemberProject } from 'src/app/Interface/memberProject';
import { MessagingService } from 'src/app/messaging.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

  private isButtonVisible = true;

  // Form groups are serialized as an object
  memberForm: FormGroup;

  validationMessages = {
    enterpriseID: {
      required: 'EnterpriseID is required.',
      minlength: 'EnterpriseID must be greater than 3',
      maxlength: 'EnterpriseID must be less than 20'
    },
    firstName: {
      required: 'First Name is required.',
    },
    lastName: {
      required: 'Last Name is required.',
    },
    gender: {
      required: 'Gender is required.'
    },
    cellNumber: {
      required: 'Cell Number is required.',
      minlength: 'Cellphone number must be 10 digits',
      maxlength: 'Cell Number equals to 10 digits'
    },
    dateOfBirth: {
      required: 'Date of Birth is required.'
    },
    capability: {
      required: 'Capability is required.'
    },
    careerLevel: {
      required: 'Career Level is required.'
    }
  };

  formErros = {
    enterpriseID: '',
    firstName: '',
    lastName: '',
    gender: '',
    cellNumber: '',
    dateOfBirth: '',
    capability: '',
    careerLevel: ''
  };
  member: User;
  pageTitle: string;

  constructor(private memberFormBuilder: FormBuilder, private route: ActivatedRoute, private http: HttpClient,
    private memberService: MemberService, private router: Router, private projectService: ProjectService,
    private notificationService: MessagingService) {
    // this.RetrieveData();
    // this.addProjectGroup();
  }

  sentUser: any;
  projects: any = [];
  project: MemberProject;
  projectNumber = 2;

  ngOnInit() {
    this.memberForm = this.memberFormBuilder.group({
      enterpriseID: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators]],
      lastName: ['', [Validators.required]],
      gender: ['', Validators.required],
      cellNumber: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(14)]],
      dateOfBirth: ['', [Validators.required]],
      capability: ['', [Validators.required]],
      careerlevel: ['', [Validators.required]],
      IsAdmin: [],
      project: this.memberFormBuilder.array([
        this.addProjectGroup()
      ])
    });

    this.memberForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.memberForm);
    });

    this.route.paramMap.subscribe(params => {
      const memberID = params.get('id');
      if (memberID) {
        this.pageTitle = 'Update';
        this.getMember(memberID);
      }
    });

    this.projectService.getProjects().subscribe(
      (listProjects) => this.projects = listProjects
      // console.log(this.projects);
    );
  }

  editMember(member: User) {
    this.memberForm.patchValue({
      enterpriseID: member.enterpriseID,
      firstName: member.firstName,
      middleName: member.middleName,
      lastName: member.lastName,
      gender: member.gender,
      cellNumber: member.cellNumber,
      dateOfBirth: member.dateOfBirth,
      capability: member.capability,
      careerlevel: member.careerlevel,
      IsAdmin: member.IsAdmin
    });
    this.memberForm.setControl('project', this.setExistingProjectDetails(member.project));
  }

  phonenumber(inputtxt) {
    const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if ((inputtxt.value.match(phoneno))) {
      return true;
    } else {
      alert('message');
      return false;
    }
  }

  getMember(id: string) {
    this.memberService.getMember(id).subscribe(
      (member: User) => {
        this.editMember(member);
        this.member = member;
      },
      (err: any) => console.log(err)
    );
  }

  addAddress() {
    this.projectArray.push(this.addProjectGroup());
  }
  removeAddress(index) {
    this.projectArray.removeAt(index);
  }

  addProjectGroup() {
    return this.memberFormBuilder.group({
      projectName: [null, Validators.required],
      status: [null, Validators.required],
      memberStartDate: [null, Validators.required],
      memberPlannedRollOff: [null, Validators.required]
    });
  }

  get projectArray() {
    return this.memberForm.get('project') as FormArray;
  }

  setExistingProjectDetails(projectSets: MemberProject[]): FormArray {
    const formArray = new FormArray([]);
    projectSets.forEach(p => {
      formArray.push(this.memberFormBuilder.group({
        projectName: p.projectName,
        status: p.status,
        memberStartDate: p.memberStartDate,
        memberPlannedRollOff: p.memberPlannedRollOff
      }));
    });

    return formArray;
  }

  logValidationErrors(group: FormGroup = this.memberForm): void {
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

  onSubmit(): void {
    this.MapFormValuesToMemberModel();

    if (this.member.uid) {
      this.notify();
      this.memberService.updateMember(this.member).subscribe(
        () => this.router.navigate(['admin-team-list']),
        (err: any) => console.log(err)
      );
    }
  }

  MapFormValuesToMemberModel() {
    this.member.enterpriseID = this.memberForm.value.enterpriseID;
    this.member.firstName = this.memberForm.value.firstName;
    this.member.middleName = this.memberForm.value.middleName;
    this.member.lastName = this.memberForm.value.lastName;
    this.member.gender = this.memberForm.value.gender;
    this.member.cellNumber = this.memberForm.value.cellNumber;
    this.member.dateOfBirth = this.memberForm.value.dateOfBirth;
    this.member.capability = this.memberForm.value.capability;
    this.member.careerlevel = this.memberForm.value.careerlevel;
    this.member.IsAdmin = this.memberForm.value.IsAdmin;
    this.member.project = this.memberForm.value.project;
  }

  notify() {
    const data: Array<any> = [];
    data.push({
      title: 'Member',
      alertContent: 'Member succesfully updated',
    });
    this.notificationService.generateNotification(data);
  }



}
