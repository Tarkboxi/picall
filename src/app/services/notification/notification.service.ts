import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserNotification } from '../../models/UserNotification.model';
import { ToastrService } from 'ngx-toastr';
import * as _ from '../../../utils/lodash-bundles';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private loading = new BehaviorSubject<boolean>(false);
  notifyDuration = 3;

  constructor(private toastrService: ToastrService) { }

  setLoading(status) {
    this.loading.next(status);
  }

  get loadingListener() {
    return this.loading.asObservable();
  }

  notifyUserSuccess(notificationMessage) {
    this.toastrService.success(notificationMessage, '',
    {
      positionClass: 'toast-bottom-right',
      timeOut: this.notifyDuration* 1000,
    });
  }

  notifyUserError(notificationMessage) {
    this.toastrService.error(notificationMessage, '',
    {
      positionClass: 'toast-bottom-right',
      timeOut: this.notifyDuration* 1000,
    });
  }

  notifyUserInfo(notificationMessages: UserNotification) {
    this.toastrService.info(this.buildInfoTemplate(notificationMessages), '',
    {
      positionClass: 'toast-bottom-right',
      timeOut: (this.notifyDuration+1)* 1000,
      enableHtml: true
    });
  }

  buildInfoTemplate(notificationMessages) {
    let template = "";
    _.forEach(notificationMessages.success, function(message) {
      template += message;
      template += "<br>";
    })
    _.forEach(notificationMessages.error, function(message) {
      template += message;
      template += "<br>";
    })
    return template;
  }

}
