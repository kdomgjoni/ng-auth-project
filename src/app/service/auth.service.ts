import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email, password){
    return this.http.post<any>('https://testapi.nuka.dev/api/auth/login', {email, password})
  }

}
