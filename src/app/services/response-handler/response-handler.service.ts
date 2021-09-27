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
    this.notificationService.notifyUserError(errorBody.message.message);
    this.authService.logout(errorBody.message.message);
  }

  handle404Error = (errorBody) => {
    this.notificationService.notifyUserError(errorBody.message.message);
    this.authService.logout(errorBody.message.message);
  }

  handle403Error = (errorBody) => {
    this.notificationService.notifyUserError(errorBody.message.message);
  }

  handle500Error = (errorBody) => {
    this.notificationService.notifyUserError(errorBody.message.message);
  }

  handleErrorByStatus(httpError: HttpErrorResponse) {
    _.invoke(this, 'handle'+httpError.status+'Error', httpError.error);
  }

  handle200Response = (responseBody) => {
    this.notificationService.notifyUserSuccess(responseBody.message);
  }

  handle201Response = (responseBody) => {
    this.notificationService.notifyUserSuccess(responseBody.message);
  }

  handleResponseByStatus(response) {
    _.invoke(this, 'handle'+response.status+'Response', response.body);
  }

}
