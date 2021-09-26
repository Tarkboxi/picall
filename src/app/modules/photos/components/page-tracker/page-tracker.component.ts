import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PhotoDisplayer } from 'src/app/models/photo-displayer.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-page-tracker',
  templateUrl: './page-tracker.component.html',
  styleUrls: ['./page-tracker.component.scss']
})
export class PageTrackerComponent implements OnInit {
  photoDisplayer: PhotoDisplayer;
  pageEvent: PageEvent;
  pageNumberSubscription: Subscription;
  photosSubscription: Subscription;
  loadingSubscription: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  disablePageNav = true;

  constructor(private photoService: PhotoService, private notificationService: NotificationService) { }

  ngOnInit(): void {

    this.photosSubscription = this.photoService.PhotoUpdateListener.subscribe((data => {
      this.photoDisplayer = data;
    }));

    this.pageNumberSubscription = this.photoService.updatePageNumberListener.subscribe((data => {
      this.paginator.pageIndex = data - 1;
    }));


    this.loadingSubscription = this.notificationService.loadingListener.subscribe((data => {
      this.disablePageNav = data;
    }));

  }

  ngOnDestroy(): void {
    this.photosSubscription.unsubscribe();
    this.pageNumberSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }

  getPhotos(event) {
    this.photoService.getPhotos(event.pageIndex+1);
    return event;
  }

}
