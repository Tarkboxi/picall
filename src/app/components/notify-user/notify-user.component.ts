import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
import { UserNotification } from 'src/app/models/UserNotification.model';
@Component({
  selector: 'app-notify-user',
  templateUrl: './notify-user.component.html',
  styleUrls: ['./notify-user.component.scss']
})
export class NotifyUserComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: UserNotification) {
  }

  ngOnInit(): void {
  }

}
