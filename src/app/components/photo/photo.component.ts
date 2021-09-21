import { Component, Input, OnInit } from '@angular/core';
import { Photo } from 'src/app/models/Photo.model';
import { PhotoService } from 'src/app/services/photo.service';
import { MatDialog } from '@angular/material/dialog';
import { PhotoViewerComponent } from './photo-viewer/photo-viewer.component';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  @Input() photo: Photo;
  constructor(private photoService: PhotoService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  like() {
    this.photoService.likePhoto(this.photo.id);
  }

  openDialog() {
    this.dialog.open(PhotoViewerComponent, { data: this.photo} );
  }

}
