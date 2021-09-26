import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PhotoDisplayer } from 'src/app/models/photo-displayer.model';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
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
  pageNumberSubscription: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private photoService: PhotoService) { }

  ngOnInit(): void {

    this.photosSubscription = this.photoService.PhotoUpdateListener.subscribe((data => {
      this.photoDisplayer = data;
    }));

    this.pageNumberSubscription = this.photoService.updatePageNumberListener.subscribe((data => {
      this.paginator.pageIndex = data - 1;
    }));

  }

  ngOnDestroy(): void {
    this.photosSubscription.unsubscribe();
    this.pageNumberSubscription.unsubscribe();
  }

  getPhotos(event) {
    this.photoService.getPhotos(event.pageIndex+1);
    return event;
  }

}
