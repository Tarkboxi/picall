import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PhotoDisplayer } from 'src/app/models/photo-displayer.model';
import { PhotoService } from 'src/app/services/photo.service';
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
