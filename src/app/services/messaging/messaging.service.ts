import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserNotification } from 'src/app/models/UserNotification.model';
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

  addPhotoSuccessMessage(total, added) {
    let succeses = [];
    let errors = [];
    if(added > 0) {
      succeses.push("Successfully added: "+added+" photos.");
    }
    if(total - added > 0) {
      errors.push("Failed to add: "+(total-added)+" photos.");
      errors.push("Reason: Invalid image type");
    }
    return {error: errors, success: succeses};
  }

}
