import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
@Component({
  selector: 'app-notify-user',
  templateUrl: './notify-user.component.html',
  styleUrls: ['./notify-user.component.scss']
})
export class NotifyUserComponent implements OnInit {

  constructor( public sbRef: MatSnackBarRef<NotifyUserComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: any) {

  }

  ngOnInit(): void {
  }

}
