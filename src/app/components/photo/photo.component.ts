import { Component, Input, OnInit } from '@angular/core';
import { Photo } from 'src/app/models/Photo.model';
import { MatDialog } from '@angular/material/dialog';
import { PhotoViewerComponent } from './photo-viewer/photo-viewer.component';


@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  @Input() photo: Photo;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(PhotoViewerComponent, { data: this.photo, autoFocus: false, height: "90vh", width: "100vw" } );
  }

}
