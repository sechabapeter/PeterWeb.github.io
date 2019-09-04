import { AngularFireModule } from '@angular/fire';
import { environment } from './../environments/environment';

import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './members/profile/profile.component';
import { HomeComponent } from './members/home/home.component';
import { TeamListComponent } from './members/team-list/team-list.component';
import { AdminTeamListComponent } from './admin/admin-team-list/admin-team-list.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { ManageProjectsComponent } from './admin/manage-projects/manage-projects.component';
import { MemberProfileComponent } from './members/member-profile/member-profile.component';
import { InforProjectComponent } from './admin/infor-project/infor-project.component';
import { CreateProjectComponent } from './admin/create-project/create-project.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpdateProfileComponent } from './admin/update-profile/update-profile.component';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';
import * as firebase from 'firebase/app';
import { FilterPipe } from './filter.pipe';
import { HttpClientModule } from '@angular/common/http';
import { MemberService } from './Service/member.service';
import { ProjectService } from './Service/projects.service';
import { UserManagementComponentComponent } from './user-management-component/user-management-component.component';


import { RouterModule, Routes } from '@angular/router';

import { UserFormComponent } from './user-form/user-form.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
export const firebaseConfig = environment.firebaseConfig;



@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
    NavigationComponent,
    HomeComponent,
    TeamListComponent,
    ProfileComponent,
    AdminTeamListComponent,
    AdminHomeComponent,
    ManageProjectsComponent,
    MemberProfileComponent,
    InforProjectComponent,
    CreateProjectComponent,
    NotificationsComponent,
    UpdateProfileComponent,
    AdminNavigationComponent,
    FilterPipe,
    UserManagementComponentComponent,
    UserFormComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      closeButton: true
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    Title,
    MemberService,
    ProjectService,
    AuthService,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    Title,
    MemberService,
    AngularFireAuth,
    AngularFirestore

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

