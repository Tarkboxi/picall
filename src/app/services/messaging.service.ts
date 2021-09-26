import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash-es';

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

  addPhotoSuccessMessage(count) {
    return ["Successfully added: "+count+" photos."];
  }

  addPhotoFailureMessage(error: HttpErrorResponse[]) {
    let errors = [];
    if(!isEmpty(error)) {
      errors.push("Failed to add: "+error.length+" photos.");
      errors.push("Reason: "+error[0]);
    }
    return errors;
  }
}
