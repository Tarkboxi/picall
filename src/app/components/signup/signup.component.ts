import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MessagingService } from 'src/app/services/messaging.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup;

  constructor(private readonly formBuiler: FormBuilder, private authService: AuthService, private messagingService: MessagingService) {
    this.form = this.formBuiler.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      rePassword: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
  }

  signUp() {
    this.authService.signUp(this.form.value);
  }
  emailErrorMessage() {
    return this.messagingService.emailFormValidationError();
  }
  passwordErrorMessage() {
    return this.messagingService.passwordFormValidationError();
  }
  rePasswordErrorMessage() {
    return this.messagingService.passwordMatchFormValidationError();
  }

}
