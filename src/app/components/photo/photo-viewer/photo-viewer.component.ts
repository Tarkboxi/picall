import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Photo } from 'src/app/models/Photo.model';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoViewerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public photo: Photo, private photoService: PhotoService) {
  }

  ngOnInit(): void {
  }

  download() {
    this.photoService.downloadPhoto(this.photo.url);
  }

}
