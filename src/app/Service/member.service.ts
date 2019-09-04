import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { IMember } from "../Interface/IMember";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../Interface/User';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserRegister } from '../Interface/userRegister';



@Injectable()
export class MemberService {

    constructor(private httpClient: HttpClient, private db: AngularFireDatabase) {

    }

    url = 'http://localhost:3000/users';
    registerURL = 'http://127.0.0.1:3000/api/register';

    getMembers(): Observable<User[]> {
        return this.httpClient.get<User[]>(this.url)
            .pipe(catchError(this.handleError));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.error('Client Side Error: ', errorResponse.error)
        } else {
            console.error('Server Side Error: ', errorResponse);
        }

        return throwError('There is a problem with the service. We are notified & working on it. Please try again later');
    }

    getMember(id: string): Observable<User> {
        return this.httpClient.get<User>(`${this.url}/${id}`)
            .pipe(catchError(this.handleError));
    }

    // addMembers(member: User): Observable<User> {
    //     return this.httpClient.post<User>(this.url, member, {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json'
    //         })
    //     })
    //         .pipe(catchError(this.handleError));
    // }

    updateMember(member: User): Observable<void> {
        return this.httpClient.put<void>(`${this.url}/${member.uid}`, member, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }

    deleteEmployee(id: string): Observable<void> {
        return this.httpClient.delete<void>(`${this.url}/${id}`)
            .pipe(catchError(this.handleError));
    }
    addMember(member: UserRegister): Observable<UserRegister> {
        return this.httpClient.post<UserRegister>(this.registerURL, member, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }
}
