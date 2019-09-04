export interface Roles {
  uid: string;
  email: string;
  photoURL: string;
  enterpriseID?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  cellNumber?: number;
  capability?: string;
  careerlevel?: number;
  IsAdmin?: boolean;
}

// export class User {
//     email:    string;
//     password: string;
//     roles:    Roles;
  

  
  //  constructor(authData) {
  //   this.email    = authData.email
  //   this.password = authData.password
  //   this.roles    = {teamMember: true}  
  // }
//}
