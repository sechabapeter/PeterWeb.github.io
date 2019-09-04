import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ProjectService } from 'src/app/Service/projects.service';
import { IProject } from 'src/app/Interface/IProject';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MemberService } from 'src/app/Service/member.service';
import { MemberInfo } from '../../Interface/MemberInfo';
import { MessagingService } from '../../messaging.service';
import { element } from '@angular/core/src/render3';
import { AngularFirestore, sortedChanges } from '@angular/fire/firestore';
import { Subject, combineLatest } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-infor-project',
  templateUrl: './infor-project.component.html',
  styleUrls: ['./infor-project.component.scss']
})
export class InforProjectComponent implements OnInit {

  projects: IProject[] = [];

  // Form groups are serialized as an object
  projectForm: FormGroup;

  validationMessages = {
    projectID: {
      required: 'Project ID is required.',
      maxlength: 'Project ID must not be lesss than 10 nor greater than 10 characters of code',
      minlength: 'Project ID must not be lesss than 10 nor greater than 10 characters of code'
    },
    projectName: {
      required: 'Project name is required.',
    },
    clientName: {
      required: 'Client name is required.',

    },
    projectManager: {
      required: 'Project manager is required.'
    },
    startDate: {
      required: 'Start date is required.'
    },
    plannedRollOff: {
      required: 'Planned roll off is required.'
    },
    capability: {
      required: 'Capability is required.'
    },
    description: {
      required: 'Project description is required.'
    }
  };




  formErros = {
  };

  project: IProject;
  pageTitle: string;
  members: MemberInfo[] = [];
  randomstring: any;

  // tslint:disable-next-line: max-line-length
  constructor(private afs: AngularFirestore, private projectFormBuilder: FormBuilder, private memberService: MemberService, private route: ActivatedRoute,
    // tslint:disable-next-line:max-line-length
    private http: HttpClient, private projectService: ProjectService, private router: Router, private notificationService: MessagingService) {

  }

  input = true;
  memberList;
  txtName;
  txtDate;
  txtStatus;
  projectItem: any;
  member: any = [];

  isDisabled = true;

  ngOnInit() {
    this.projectService.getProjects().subscribe(
      (listProjects) => this.projects = listProjects.sort(),
    );
    this.projectForm = this.projectFormBuilder.group({
      projectID: [''],
      projectName: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      projectManager: [''],
      startDate: ['', Validators.required],
      plannedRollOff: ['', Validators.required],
      actualRollOff: ['', Validators.required],
      description: ['', Validators.required],
      members: this.projectFormBuilder.array([
        this.addMemberFormGroup()
      ])
    });

    // this.memberService.getMembers().subscribe(
    //   (listMembers) => {
    //     const allMembers = Object.entries(listMembers);
    //     allMembers.forEach(member => {
    //       const newMember = member[1];
    //       newMember.uid = member[0].toString();

    //       this.member.push(newMember);
    //     });
    //     console.log(this.member);
    //   },
    //   (err) => console.log(err)
    // );

    // this.projectForm.valueChanges.subscribe((data) => {
    //   this.logValidationErrors(this.projectForm);
    // });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pageTitle = 'Update';
        this.getProject(id);
      } else {
        this.pageTitle = 'Add new project';
        this.project = {
          id: null,
          projectID: '',
          projectName: '',
          clientName: '',
          projectManager: '',
          startDate: '',
          plannedRollOff: '',
          actualRollOff: '',
          description: '',
        };
      }
    });

    this.generate();

  }

  addMemberFormGroup(): FormGroup {
    return this.projectFormBuilder.group({
      searchMember: ['', Validators.required],
      memberName: ['', Validators.required],
      status: ['', Validators.required],
      memberStartDate: ['', Validators.required],
      memberPlannedRollOff: ['', Validators.required]
    });
  }

  getProject(id: string) {
    this.projectService.getProject(id).subscribe(
      (project: IProject) => {
        this.editProject(project);
        this.project = project;
      },
      (err: any) => console.log(err)
    );
  }

  editProject(project: IProject) {
    this.projectForm.patchValue({
      projectID: project.projectID,
      projectName: project.projectName,
      clientName: project.clientName,
      projectManager: project.projectManager,
      startDate: project.startDate,
      plannedRollOff: project.plannedRollOff,
      actualRollOff: project.actualRollOff,
      description: project.description
    });
    // this.projectForm.setControl('members', this.setExistingMember(project.members));
  }

  setExistingMember(memberSets: MemberInfo[]): FormArray {
    const formArray = new FormArray([]);
    memberSets.forEach(m => {
      formArray.push(this.projectFormBuilder.group({
        searchMember: m.searchMember,
        memberName: m.memberName,
        memberStartDate: m.memberStartDate,
        status: m.status,
        memberPlannedRollOff: m.memberPlannedRollOff
      }));
    });

    return formArray;
  }

  logValidationErrors(group: FormGroup = this.projectForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErros[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErros[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  addMember(): void {
    (this.projectForm.get('members') as FormArray).push(this.addMemberFormGroup());
  }

  removeMember(memberGroupIndex: number): void {
    const membersFormArray = this.projectForm.get('members') as FormArray;
    membersFormArray.removeAt(memberGroupIndex);
    membersFormArray.markAsDirty();
    membersFormArray.markAsTouched();
  }

  MapFormValuesToMemberModel() {
    this.project.projectID = this.projectForm.value.projectID;
    this.project.projectName = this.projectForm.value.projectName;
    this.project.clientName = this.projectForm.value.clientName;
    this.project.projectManager = this.projectForm.value.projectManager;
    this.project.startDate = this.projectForm.value.startDate;
    this.project.actualRollOff = this.projectForm.value.actualRollOff;
    this.project.plannedRollOff = this.projectForm.value.plannedRollOff;
    this.project.description = this.projectForm.value.description;
    // this.project.members = this.projectForm.value.members;
  }

  onSubmit(): void {
    this.MapFormValuesToMemberModel();

    if (this.project.id) {
      this.notifyMember();
      this.projectService.updateProject(this.project).subscribe(
        () => this.router.navigate(['manage-projects']),
        (err: any) => console.log(err)
      );
    } else {
      this.notify();
      this.projectService.addProject(this.project).subscribe(
        () => this.router.navigate(['manage-projects']),
        (err: any) => console.log(err)
      );
    }
  }

  notify() {
    const data: Array<any> = [];
    data.push({
      title: 'Project',
      // tslint:disable-next-line:max-line-length
      alertContent: 'New Project was succesfully created',
    });
    this.notificationService.generateNotification(data);
  }


  notifyMember() {
    const data: Array<any> = [];
    data.push({
      title: 'Project',
      // tslint:disable-next-line:max-line-length
      alertContent: 'New Project was succesfully updated',
    });
    this.notificationService.generateNotification(data);
  }

  generate() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // tslint:disable-next-line:variable-name
    const string_length = 1;
    this.randomstring = Math.random().toString(36).slice(-4);
    for (let i = 0; i < string_length; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      this.randomstring += chars.substring(rnum, rnum + 1);
    }
  }

}
