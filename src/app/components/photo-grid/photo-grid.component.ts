import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PhotoDisplayer } from 'src/app/models/photo-displayer.model';
import { PhotoService } from 'src/app/services/photo.service';

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

  constructor(private photoService: PhotoService) {
    this.count = 10;
    this.page = 1;
  }

  ngOnInit(): void {
    this.photoService.getPhotos(this.count, this.page);

    this.photosSubscription = this.photoService.PhotoUpdateListener.subscribe((data => {
      this.photoDisplayer = data;
    }))
  }

  ngOnDestroy(): void {
    this.photosSubscription.unsubscribe();
  }

}
