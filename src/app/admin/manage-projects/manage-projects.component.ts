import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { InforProjectComponent } from '../infor-project/infor-project.component';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { Title } from '@angular/platform-browser';
import { ProjectService } from '../../Service/projects.service';
import { IProject } from 'src/app/Interface/IProject';



@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.scss']
})
export class ManageProjectsComponent implements OnInit {

  dataTable: any;

  projects: IProject[] = [];

  constructor(private chRef: ChangeDetectorRef, public route: Router, private projectService: ProjectService) { }

  // Initialize Firebase

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

    this.projectService.getProjects().subscribe(
      (listProjects) => this.projects = listProjects,
    );
// tslint:disable-next-line: no-unused-expression
    (err) => console.log(err);

  }

  updateProject(id: string) {
    // this.route.config.find(r => r.component === UpdateProfileComponent).data = id;
    this.route.navigate(['/infor-project', id]);
    console.log(id);
  }


}
