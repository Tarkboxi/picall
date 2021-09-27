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

  formEmailValidationError() {
    return "Invalid email.";
  }

  formPasswordValidationError() {
    return "Should be between 4-12 characters";
  }

  formPasswordMismatchError() {
    return "Passwords don't match.";
  }

  userLogoutMessage() {
    return "Logged out.";
  }

  unknownServerError() {
    return "Unknown server error.";
  }

  photoFetchSuccess() {
    return "Fetched Photos";
  }

  photoDeleteSuccess() {
    return "Successfully Deleted Photos";
  }

  addPhotoSuccessMessage(count) {
    if(count > 0) {
      return ["Successfully added: "+count+" photos."];
    }
    return[];
  }

  addPhotoFailureMessage(httpErrors: HttpErrorResponse[]) {
    let errors = [];
    if(!_.isEmpty(httpErrors)) {
      errors.push("Failed to add: "+httpErrors.length+" photos.");
      errors.push("Reason: "+httpErrors[0].error.errors[0].title);
    }
    return errors;
  }
}
