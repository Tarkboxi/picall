import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MessagingService } from 'src/app/services/messaging.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private readonly formBuiler: FormBuilder, private authService: AuthService, private messagingService: MessagingService) {
    this.form = this.formBuiler.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
  }

  emailErrorMessage() {
    return this.messagingService.emailFormValidationError();
  }

  passwordErrorMessage() {
    return this.messagingService.passwordFormValidationError();
  }

  login() {
    this.authService.login(this.form.value);
  }
}
