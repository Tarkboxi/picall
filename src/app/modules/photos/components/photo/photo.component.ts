import { Component, Input, OnInit } from '@angular/core';
import { Photo } from 'src/app/models/Photo.model';
import { MatDialog } from '@angular/material/dialog';
import { PhotoViewerComponent } from './photo-viewer/photo-viewer.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PhotoService } from 'src/app/services/photo/photo.service';


@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  @Input() photo: Photo;
  loading: boolean = true;
  userId: string;
  selected: boolean = false;

  constructor(public dialog: MatDialog, private authService: AuthService, private photoService: PhotoService) {
    this.userId = authService.getUserId();
  }

  ngOnInit(): void {
    this.selected = this.photoService.isSelected(this.photo.id);
  }

  openDialog() {
    this.dialog.open(PhotoViewerComponent, { data: this.photo, autoFocus: false, height: "90vh", width: "100vw" } );
  }

  loaded() {
    this.loading = false;
  }

  selectPhoto() {
    this.photoService.selectPhotos([this.photo]);
  }

  deselectPhoto() {
    this.photoService.deselectPhotos([this.photo]);
  }

}
