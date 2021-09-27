import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Photo } from 'src/app/models/Photo.model';
import { PhotoService } from 'src/app/services/photo/photo.service';

@Component({
  selector: 'app-photo-control',
  templateUrl: './photo-control.component.html',
  styleUrls: ['./photo-control.component.scss']
})
export class PhotoControlComponent implements OnInit {
  selectedPhotos: Photo[] = [];
  selectedPhotosSubscription: Subscription;

  constructor(private photoService: PhotoService) {
  }

  ngOnInit(): void {
    this.selectedPhotosSubscription = this.photoService.SelectedPhotoListener.subscribe((data)=>{
      this.selectedPhotos = data;
    });
  }

  ngOnDestroy(): void {
    this.selectedPhotosSubscription.unsubscribe();
  }

  async delete() {
    await this.photoService.deletePhotos(this.selectedPhotos);
  }
}
