import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PhotoDisplayer } from 'src/app/models/photo-displayer.model';
import {PageEvent} from '@angular/material/paginator';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-page-tracker',
  templateUrl: './page-tracker.component.html',
  styleUrls: ['./page-tracker.component.scss']
})
export class PageTrackerComponent implements OnInit {
  photosSubscription: Subscription;
  photoDisplayer: PhotoDisplayer;
  pageEvent: PageEvent;

  constructor(private photoService: PhotoService) { }

  ngOnInit(): void {
    this.photosSubscription = this.photoService.PhotoUpdateListener.subscribe((data => {
      this.photoDisplayer = data;
    }));
  }

  ngOnDestroy(): void {
    this.photosSubscription.unsubscribe();
  }

  getPhotos(event) {
    this.photoService.getPhotos(event.pageIndex+1);
    return event;
  }

}
