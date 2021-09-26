import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';
import { NotifyUserComponent } from '../../components/notify-user/notify-user.component';
import { UserNotification } from '../../models/UserNotification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private loading = new BehaviorSubject<boolean>(false);
  notifyDuration = 3;

  constructor(private _snackBar: MatSnackBar) { }

  setLoading(status) {
    this.loading.next(status);
  }

  get loadingListener() {
    return this.loading.asObservable();
  }

  notifyUser(notificationMessages: UserNotification) {
    this._snackBar.openFromComponent(NotifyUserComponent, {
      duration: this.notifyDuration * 1000,
      data: notificationMessages,
      horizontalPosition: "right",
      verticalPosition: "bottom",
    });
  }
}
