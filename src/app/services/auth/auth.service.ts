import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Auth } from 'src/app/models/Auth.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as _ from '../../../utils/lodash-bundles';
import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.apiUrl+'/users/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, private jwtHelperService: JwtHelperService) {
  }

  login(data: Auth) {
    return new Promise(resolve => {
      this.http.post<{data: {token: string; exp: number}}>(BACKEND_URL+'/login', data, { observe: 'response'}).subscribe(response=> {
        const token = response.body.data.token;
        if(token) {
          this.saveAuthData(token);
          this.authStatusListener.next(true);
          this.router.navigate(['/home']);
        }
        resolve(response);
      }, httpError => {
        resolve(httpError);
      });
    });
  }

  signUp(data: Auth) {
    return new Promise(resolve => {
      this.http.post<{token: string; exp: number}>(BACKEND_URL+'signup', data, { observe: 'response'}).subscribe(response=> {
        resolve(response);
      }, httpErrror => {
        resolve(httpErrror);
      });
    });
  }

  logout(message) {
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/auth']);
  }

  private saveAuthData(token: string) {
    const decoded = this.jwtHelperService.decodeToken(token);
    localStorage.setItem('expiresIn', decoded.exp);
    localStorage.setItem('userId', decoded.userId);
    localStorage.setItem('token', token);
  }

  private clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  isExpired() {
    return (new Date() > new Date(Number(localStorage.getItem('expiresIn')) * 1000));
  }

  get AuthStatusObservable() {
    return this.authStatusListener.asObservable();
  }

  getAuthStatus() {
    return !_.isNull(localStorage.getItem('token'));
  }

  getToken() {
    return localStorage.getItem('token') || "";
  }

  getUserId() {
    return localStorage.getItem("userId");
  }

}
