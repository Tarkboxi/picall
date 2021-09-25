import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { passwordMatchValidator } from 'src/app/validators/password-match';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  @Input() authTabGroup: any;

  constructor(private readonly formBuiler: FormBuilder, private authService: AuthService, private messagingService: MessagingService) {
    this.form = this.formBuiler.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      rePassword: ['', [Validators.required, Validators.minLength(4)]]
    }, {
      validators: [passwordMatchValidator],
      updateOn: 'change'
    });
  }

  ngOnInit(): void {
  }

  async signUp(form, formDirective) {
    await this.authService.signUp(form.value);
    formDirective.resetForm();
    form.reset();
    this.authTabGroup.selectedIndex = 0;
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
