import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../../messaging.service';
import { Alert } from 'selenium-webdriver';
import { database } from 'firebase';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  constructor(private httpClient: HttpClient, private notificationService: MessagingService) {

    this.notificationService.requestPermission();
    // tslint:disable-next-line:only-arrow-functions
    (() => {
      'use strict';
      // tslint:disable-next-line:only-arrow-functions
      window.addEventListener('load', () => {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        // tslint:disable-next-line:only-arrow-functions
        const validation = Array.prototype.filter.call(forms, (form) => {
          // tslint:disable-next-line:only-arrow-functions
          form.addEventListener('submit', (event) => {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    })();
  }

  user = {
    Project_ID: '',
    Project_Name: '',
    Client_Name: '',
    Start_Date: '',
    End_Date: '',
    Project_Manager: '',
    description: '',
  };
  ngOnInit() {
  }
  submit() {
    this.httpClient.post('http://127.0.0.1:3000/projects',
      {

        projectID: (document.getElementById('projectID') as HTMLInputElement).value,
        projectName: (document.getElementById('projectName') as HTMLInputElement).value,
        clientName: (document.getElementById('clientName') as HTMLInputElement).value,
        startDate: (document.getElementById('fromdatepicker') as HTMLInputElement).value,
        endDate: (document.getElementById('fromdatepickersend') as HTMLInputElement).value,
        projectManager: (document.getElementById('projectManger') as HTMLInputElement).value,
        description: (document.getElementById('description') as HTMLInputElement).value,

      })
      .subscribe(
        data => {
          console.log('POST Request is successful', data);
        },
        error => {

          console.log('Error', error);

        }

      );
  }

   notify() {
    const data: Array<any> = [];
    data.push({
      title: 'Project',
      alertContent: 'New Project was created \n Login and go to the Profile page \n and click projects tab',
    });
    this.notificationService.generateNotification(data);
  }

  createProject() {

    if (this.user.Project_ID !== '' && this.user.Project_Name !== '' && this.user.Client_Name !== '' && this.user.Start_Date !== ''
      && this.user.End_Date !== '' && this.user.Project_Manager !== '' && this.user.description !== '') {

      this.notify();

    } else if (this.user.Project_ID === '' || this.user.Project_Name === '' || this.user.Client_Name === '' || this.user.Start_Date === ''
      || this.user.End_Date === '' || this.user.Project_Manager === '' || this.user.description === '') {

      alert('Empty field(s)!');
    }
  }

}
