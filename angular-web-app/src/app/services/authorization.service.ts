import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  API: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  login(loginData: { username: string, password: string }) {
    const authorizationData = 'Basic ' + btoa(loginData.username + ':' + loginData.password);

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': authorizationData
      })
    };
    return this.http.post<{
      first_name: string,
      second_name: string
    }>(this.API + '/api/v1/auth/login', loginData, httpOptions);
  }

  regsiter(loginData: { first_name: string, second_name: string,  username: string, email: string, password: string }) {
    return this.http.post<{
      first_name: string,
      second_name: string
    }>(this.API + '/api/v1/auth/register', loginData);
  }
}
