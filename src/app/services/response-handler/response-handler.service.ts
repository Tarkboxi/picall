import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';
import * as _ from '../../../utils/lodash-bundles';
import { MessagingService } from '../messaging/messaging.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseHandlerService {

  constructor(private notificationService: NotificationService, public dialog: MatDialog, private authService: AuthService, private messagingService: MessagingService) { }

  handle401Error = (errorBody) => {
    this.notificationService.notifyUserError(errorBody.errors[0].title);
    this.authService.logout(errorBody.errors[0].title);
  }

  handle404Error = (errorBody) => {
    this.notificationService.notifyUserError(errorBody.errors[0].title);
    this.authService.logout(errorBody.errors[0].title);
  }

  handle0Error = (errorBody) => {
    this.notificationService.notifyUserError(this.messagingService.unknownServerError());
    this.authService.logout(this.messagingService.unknownServerError());
  }

  handle403Error = (errorBody) => {
    this.notificationService.notifyUserError(errorBody.errors[0].title);
  }

  handle500Error = (errorBody) => {
    this.notificationService.notifyUserError(errorBody.errors[0].title);
  }

  handleErrorByStatus(httpError: HttpErrorResponse) {
    _.invoke(this, 'handle'+httpError.status+'Error', httpError.error);
  }

  handle200Response = (message) => {
    this.notificationService.notifyUserSuccess(message);
  }

  handle201Response = (message) => {
    this.notificationService.notifyUserSuccess(message);
  }

  handleResponseByStatus(response, message) {
    _.invoke(this, 'handle'+response.status+'Response', message);
  }

}
