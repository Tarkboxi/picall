import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MessagingService } from 'src/app/services/messaging/messaging.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitError: string;

  constructor(private readonly formBuiler: FormBuilder, private authService: AuthService, private messagingService: MessagingService, private location: Location) {
    this.form = this.formBuiler.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]]
    });
  }

  ngOnInit(): void {
    let initEmail = this.location.getState()['email'];
    if(initEmail) {
      this.form.controls.email.setValue(initEmail);
    }
  }

  emailErrorMessage() {
    return this.messagingService.emailFormValidationError();
  }

  passwordErrorMessage() {
    return this.messagingService.passwordFormValidationError();
  }

  async login() {
    let loginResult: any = await this.authService.login(this.form.value);
    if(loginResult.status != 200) {
      this.form.setErrors({'failedLogin': true});
      this.submitError = loginResult.error.message;
    }
  }
}
