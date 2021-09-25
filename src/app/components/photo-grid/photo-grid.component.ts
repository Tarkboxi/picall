import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PhotoDisplayer } from 'src/app/models/photo-displayer.model';
import { PhotoService } from 'src/app/services/photo.service';
import {PageEvent} from '@angular/material/paginator';
import { pull } from 'lodash-es';
import { pullAll } from 'lodash-es';
import { includes } from 'lodash-es';
import { filter } from 'lodash-es';

@Component({
  selector: 'app-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrls: ['./photo-grid.component.scss']
})
export class PhotoGridComponent implements OnInit {
  photosSubscription: Subscription;
  photoDisplayer: PhotoDisplayer;
  selectedPhotos: string[];
  pageEvent: PageEvent;

  constructor(private photoService: PhotoService) {
    this.selectedPhotos = [];
  }

  ngOnInit(): void {
    this.photoService.getPhotos(10, 1);

    this.photosSubscription = this.photoService.PhotoUpdateListener.subscribe((data => {
      this.photoDisplayer = data;
    }));
  }

  selectPhoto(photo) {
    this.selectedPhotos.push(photo);
  }

  deselectPhoto(photo) {
    pull(this.selectedPhotos, photo);
  }

  async delete() {
    let deletedPhotos = await this.photoService.deletePhotos(this.selectedPhotos);
    this.selectedPhotos = filter(this.selectedPhotos, (photo)=> { return !includes(deletedPhotos, photo.id)});
  }

  ngOnDestroy(): void {
    this.photosSubscription.unsubscribe();
  }

  download() {
    this.photoService.downloadPhoto("http://localhost:3000/photos/jewel1.jpeg-1632224634321.jpg");
  }

}
