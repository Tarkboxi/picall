import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor() { }

  emailFormValidationError() {
    return "Invalid email.";
  }

  passwordFormValidationError() {
    return "Should be between 8-16 characters";
  }

  passwordMatchFormValidationError() {
    return "Passwords don't match.";
  }

}
