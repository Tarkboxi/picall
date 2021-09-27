import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from '../../../utils/lodash-bundles';


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
    return "Should be between 4-12 characters";
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
    if(!_.isEmpty(httpError)) {
      errors.push("Failed to add: "+httpError.length+" photos.");
      errors.push("Reason: "+httpError[0].error.message);
    }
    return errors;
  }
}
