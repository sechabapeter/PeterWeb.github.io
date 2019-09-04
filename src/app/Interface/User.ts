import { MemberProject } from './memberProject';

export interface User {
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
    project?: MemberProject[];
}
