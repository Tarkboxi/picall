import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PhotoDisplayer } from 'src/app/models/photo-displayer.model';
import { PhotoService } from 'src/app/services/photo.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrls: ['./photo-grid.component.scss']
})
export class PhotoGridComponent implements OnInit {
  photosSubscription: Subscription;
  photoDisplayer: PhotoDisplayer;

  constructor(private photoService: PhotoService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.photoService.getPhotos(1);

    this.photosSubscription = this.photoService.PhotoUpdateListener.subscribe((data => {
      this.photoDisplayer = data;
    }));
  }

  ngOnDestroy(): void {
    this.photosSubscription.unsubscribe();
  }

}
