import { Injectable } from '@angular/core';
import { invoke } from 'lodash-es';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseHandlerService {

  constructor(private notificationService: NotificationService, public dialog: MatDialog, authService: AuthService) { }

  handle401Error = (errorBody) => {
    this.notificationService.notifyUser({success: [], error: [errorBody.message]});
  }

  handle403Error = (errorBody) => {
    this.notificationService.notifyUser({success: [], error: [errorBody.message]});
  }

  handle500Error = (errorBody) => {
    this.notificationService.notifyUser({success: [], error: [errorBody.message]});
  }

  handleErrorByStatus(httpError: HttpErrorResponse) {
    invoke(this, 'handle'+httpError.status+'Error', httpError.error);
  }

  handle200Response = (responseBody) => {
    this.notificationService.notifyUser({success: [responseBody.message], error: []});
  }

  handle201Response = (responseBody) => {
    this.notificationService.notifyUser({success: [responseBody.message], error: []});
  }

  handleResponseByStatus(response) {
    invoke(this, 'handle'+response.status+'Response', response.body);
  }

}
