import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from 'src/Interfaces/project';
import {HttpClient} from '@angular/common/http'
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'https://innovationladders.wixsite.com/website-6/_functions-dev';
  constructor(private http: HttpClient) {}

  GetProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects`);
  }
}
