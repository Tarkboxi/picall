import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Auth } from 'src/app/models/Auth.model';
import { isNull } from 'lodash-es';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, private jwtHelperService: JwtHelperService) {
  }

  login(data: Auth) {
    this.http.post<{token: string; exp: number}>("http://localhost:3000/api/users/login", data).subscribe(response=> {
      const token = response.token;
      if(token) {
        this.saveAuthData(token);
        this.authStatusListener.next(true);
        this.router.navigate(['/home']);
      }
    });
  }

  signUp(data: Auth) {
    return new Promise(resolve => {
      this.http.post<{token: string; exp: number}>("http://localhost:3000/api/users/signup", data).subscribe(response=> {
        resolve(response);
      }, error => {
      });
    });
  }

  logout() {
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private saveAuthData(token: string) {
    localStorage.setItem('userId', this.jwtHelperService.decodeToken(token).userId);
    localStorage.setItem('token', token);
  }

  private clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
  }

  get AuthStatusObservable() {
    return this.authStatusListener.asObservable();
  }

  getAuthStatus() {
    return !isNull(localStorage.getItem('token'));
  }

  getToken() {
    return localStorage.getItem('token') || "";
  }

  getUserId() {
    return localStorage.getItem("userId");
  }

}
