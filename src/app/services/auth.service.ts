import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Auth } from 'src/app/models/Auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private authStatus: boolean;

  constructor(private http: HttpClient, private router: Router) {
    this.token = "";
    this.authStatus = false;
  }

  login(data: Auth) {
    this.http.post<{token: string}>("http://localhost:3000/api/users/login", data).subscribe(response=> {
      this.token = response.token;
      this.authStatusListener.next(true);
      this.authStatus = false;
      this.router.navigate(['/home']);
    })
  }

  logout() {
    this.token = "";
    this.authStatusListener.next(false);
    this.authStatus = false;
    this.router.navigate(['/']);
  }

  get AuthStatus() {
    return this.authStatusListener.asObservable();
  }

  getAuthStatus() {
    return this.authStatus;
  }

  getToken() {
    return this.token;
  }

}
