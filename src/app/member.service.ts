import { IMember } from './admin/IMember/IMember';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = 'http://127.0.0.1:3000/members';

  constructor(private httpClient: HttpClient) {
  }

  getMembers(): Observable<IMember[]> {
    return this.httpClient.get<IMember[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }
  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error :', errorResponse.error.message);
    } else {
      console.error('Server Side Error :', errorResponse);
    }
    return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
  }
  getMember(id: string): Observable<IMember> {
    return this.httpClient.get<IMember>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
   addMember(member: IMember): Observable<IMember> {
    return this.httpClient.post<IMember>(this.baseUrl, member, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }
  updateMember(member: IMember): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${member.id}`, member, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }
  deleteEmployee(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
}
