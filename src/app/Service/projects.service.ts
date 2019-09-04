import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IProject } from '../Interface/IProject';


@Injectable()
export class ProjectService {

    constructor(private httpClient: HttpClient) {

    }
    url = 'http://localhost:3000/projects';

    getProjects(): Observable<IProject[]> {
        return this.httpClient.get<IProject[]>(this.url)
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

    getProject(id: string): Observable<IProject> {
        return this.httpClient.get<IProject>(`${this.url}/${id}`)
            .pipe(catchError(this.handleError));
    }

    addProject(project: IProject): Observable<IProject> {
        return this.httpClient.post<IProject>(this.url, project, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }

    updateProject(project: IProject): Observable<void> {
        return this.httpClient.put<void>(`${this.url}/${project.id}`, project, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }

    deleteProject(id: string): Observable<void> {
        return this.httpClient.delete<void>(`${this.url}/${id}`)
            .pipe(catchError(this.handleError));
    }
}