import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private loading = new Subject<boolean>();

  constructor() { }

  setLoading(status) {
    this.loading.next(status);
  }

  get loadingListener() {
    return this.loading.asObservable();
  }

}
