import { UserFormComponent } from './user-form/user-form.component';
import { CreateProjectComponent } from './admin/create-project/create-project.component';
import { InforProjectComponent } from './admin/infor-project/infor-project.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './members/home/home.component';
import { ProfileComponent } from './members/profile/profile.component';
import { TeamListComponent } from './members/team-list/team-list.component';
import { LoginComponent } from './login/login.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminTeamListComponent } from './admin/admin-team-list/admin-team-list.component';
import { ManageProjectsComponent } from './admin/manage-projects/manage-projects.component';
import { MemberProfileComponent } from './members/member-profile/member-profile.component';
import { UpdateProfileComponent } from './admin/update-profile/update-profile.component';
import { UserManagementComponentComponent } from './user-management-component/user-management-component.component';
import { AuthGuard } from './services/guard/auth.guard';




const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'team-list', component: TeamListComponent},
  { path: 'admin-home', component: AdminHomeComponent},
  { path: 'create-new-project', component: InforProjectComponent},
  { path: 'infor-project/:id', component: InforProjectComponent},
  { path: 'admin-team-list', component: AdminTeamListComponent},
  { path: 'manage-projects', component: ManageProjectsComponent},
  { path: 'create-project', component: CreateProjectComponent},
  { path: 'member-profile/:id', component: MemberProfileComponent},
  { path: 'add-member', component: UpdateProfileComponent},
  { path: 'user-form', component: UserFormComponent},
  { path: 'member-profile', component: MemberProfileComponent},
  { path: 'update-profile/:id', component: UpdateProfileComponent},
  { path: 'userMgmt', component: UserManagementComponentComponent },
  { path: '', component: LoginComponent }, // pathMatch: 'full' is optional if defined in this order
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // Add options right here
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
