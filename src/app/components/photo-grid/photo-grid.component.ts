import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PhotoDisplayer } from 'src/app/models/photo-displayer.model';
import { PhotoService } from 'src/app/services/photo.service';
import {pull} from 'lodash-es';

@Component({
  selector: 'app-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrls: ['./photo-grid.component.scss']
})
export class PhotoGridComponent implements OnInit {
  count: number;
  page: number;
  photosSubscription: Subscription;
  photoDisplayer: PhotoDisplayer;
  public selectedPhotos: string[];

  constructor(private photoService: PhotoService) {
    this.count = 10;
    this.page = 1;
    this.selectedPhotos = [];
  }

  ngOnInit(): void {
    this.photoService.getPhotos(this.count, this.page);

    this.photosSubscription = this.photoService.PhotoUpdateListener.subscribe((data => {
      this.photoDisplayer = data;
    }))
  }

  selectPhoto(id) {
    this.selectedPhotos.push(id);
  }

  deselectPhoto(id) {
    pull(this.selectedPhotos, id);
  }

  selectAllPhotos() {
  }

  deselectAllPhotos() {
  }

  delete() {
    this.photoService.deletePhotos(this.selectedPhotos);
  }

  ngOnDestroy(): void {
    this.photosSubscription.unsubscribe();
  }

}
