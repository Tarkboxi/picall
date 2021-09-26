import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';
import * as _ from '../../../utils/lodash-bundles';

@Injectable({
  providedIn: 'root'
})
export class ResponseHandlerService {

  constructor(private notificationService: NotificationService, public dialog: MatDialog, private authService: AuthService) { }

  handle401Error = (errorBody) => {
    this.notificationService.notifyUser({success: [], error: [errorBody.message.message]});
    this.authService.logout(errorBody.message.message);
  }

  handle403Error = (errorBody) => {
    this.notificationService.notifyUser({success: [], error: [errorBody.message]});
  }

  handle500Error = (errorBody) => {
    this.notificationService.notifyUser({success: [], error: [errorBody.message]});
  }

  handleErrorByStatus(httpError: HttpErrorResponse) {
    _.invoke(this, 'handle'+httpError.status+'Error', httpError.error);
  }

  handle200Response = (responseBody) => {
    this.notificationService.notifyUser({success: [responseBody.message], error: []});
  }

  handle201Response = (responseBody) => {
    this.notificationService.notifyUser({success: [responseBody.message], error: []});
  }

  handleResponseByStatus(response) {
    _.invoke(this, 'handle'+response.status+'Response', response.body);
  }

}
