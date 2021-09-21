import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Auth } from 'src/app/models/Auth.model';
import { isNull } from 'lodash-es';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {
  }

  login(data: Auth) {
    this.http.post<{token: string; exp: number}>("http://localhost:3000/api/users/login", data).subscribe(response=> {
      const token = response.token;
      if(token) {
        this.authStatusListener.next(true);
        this.saveAuthData(token);
        this.router.navigate(['/home']);
      }
    });
  }

  signUp(data: Auth) {
    this.http.post<{token: string; exp: number}>("http://localhost:3000/api/users/login", data).subscribe(response=> {
      const token = response.token;
      if(token) {
        this.authStatusListener.next(true);
        this.saveAuthData(token);
        this.router.navigate(['/home']);
      }
    });
  }

  logout() {
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string) {
    localStorage.setItem('token', token);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
  }

  get AuthStatusObservable() {
    return this.authStatusListener.asObservable();
  }

  getAuthStatus() {
    return isNull(localStorage.getItem('token'));
  }

  getToken() {
    return localStorage.getItem('token') || "";
  }

}
