import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services//auth/auth.service';
import { MessagingService } from 'src/app/services/messaging/messaging.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { passwordMatchValidator } from 'src/app/validators/password-match';
import { FormTabService } from '../auth/tab-track/form-tab.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  @Input() authTabGroup: any;
  submitError: string;

  constructor(private readonly formBuiler: FormBuilder, private authService: AuthService, private messagingService: MessagingService, private router: Router, private tabService: FormTabService, private notificationService: NotificationService) {
    this.form = this.formBuiler.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      rePassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]]
    }, {
      validators: [passwordMatchValidator],
      updateOn: 'change'
    });
  }

  ngOnInit(): void {
  }

  async signUp(form) {
    let email = form.value.email;
    let signupResult: any = await this.authService.signUp(form.value);
    if(signupResult.status != 201) {
      this.form.setErrors({'failedSignup': true});
      this.submitError = signupResult.error.message;
    } else {
      this.router.navigate(['/auth/login'],{state: {email: email}});
      this.tabService.changeTab(0);
      this.notificationService.notifyUserSuccess(this.messagingService.signupSuccessMessage());
    }
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
