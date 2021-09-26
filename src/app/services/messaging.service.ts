import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor() { }

  signupSuccessMessage() {
    return "Successfully created account. Use your password to login.";
  }

  emailFormValidationError() {
    return "Invalid email.";
  }

  passwordFormValidationError() {
    return "Should be between 8-16 characters";
  }

  passwordMatchFormValidationError() {
    return "Passwords don't match.";
  }

  userLogoutMessage() {
    return "Logged out.";
  }

  addPhotoSuccessMessage(count) {
    if(count > 0) {
      return ["Successfully added: "+count+" photos."];
    }
    return[];
  }

  addPhotoFailureMessage(httpError: HttpErrorResponse[]) {
    let errors = [];
    if(!isEmpty(httpError)) {
      errors.push("Failed to add: "+httpError.length+" photos.");
      errors.push("Reason: "+httpError[0].error.message);
    }
    return errors;
  }
}
