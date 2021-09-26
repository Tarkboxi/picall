import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormTabService {
  private tabChange = new Subject<any>();

  constructor() { }

  changeTab(index) {
    this.tabChange.next(index);
  }

  get tabChangeListener() {
    return this.tabChange.asObservable();
  }

}
