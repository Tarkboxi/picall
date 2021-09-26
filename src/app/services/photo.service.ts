import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject, zip } from 'rxjs';
import { PhotoDisplayer } from '../models/photo-displayer.model';
import { catchError, map, switchMap } from 'rxjs/operators';
import { concat } from 'lodash-es';
import { forEach } from 'lodash-es';
import { includes } from 'lodash-es';
import { filter } from 'lodash-es';
import { map as _map } from 'lodash-es'
import { take } from 'lodash-es'
import * as fileSaver from 'file-saver';
import { Photo } from '../models/Photo.model';
import { NotificationService } from './notification.service';
import { MessagingService } from './messaging.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photoDisplay: PhotoDisplayer = {photos: [], total: 0, count: 5, page: 1};
  private photosUpdated = new BehaviorSubject<PhotoDisplayer>(this.photoDisplay);
  private selectedPhotosListener = new Subject<Photo[]>();
  private selectedPhotos: Photo[] = [];
  private updatePageNumber = new Subject<number>();

  constructor(private httpClient: HttpClient, private notificationService: NotificationService, private messagingService: MessagingService) {
  }

  get PhotoUpdateListener() {
    return this.photosUpdated.asObservable();
  }

  get updatePageNumberListener() {
    return this.updatePageNumber.asObservable();
  }

  get SelectedPhotoListener() {
    return this.selectedPhotosListener.asObservable();
  }

  addPhotos(photos) {
    const uploads = [];
    forEach(photos, (photo) => {
      let postData = new FormData();
      postData.append("photo", photo);
      let upload = this.httpClient.post<any>('http://localhost:3000/api/photos', postData)
      .pipe(
        map(data => {
          return { photos: data.photos.map(photo => {
            return {
              url: photo.url,
              id: photo._id,
              creator: photo.creator
            };
          }),
          additions: data.total
          };
        }),
        catchError(error => of(error))
      )
      uploads.push(upload);
    })
    zip(...uploads).subscribe((zippedResponse)=> {
      let errors = [];
      forEach(zippedResponse, (mappedData) => {
        if(mappedData instanceof HttpErrorResponse) {
          errors.push(mappedData);
        } else if(this.photoDisplay.page == 1) {
          this.photoDisplay.photos = concat(mappedData.photos, this.photoDisplay.photos);
        }
      });
      if(this.photoDisplay.photos.length > this.photoDisplay.count) {
        this.photoDisplay.photos = take(this.photoDisplay.photos, this.photoDisplay.count);
      }
      let adds = zippedResponse.length - errors.length;
      this.photoDisplay.total += adds;
      this.addResultNotification(adds, errors);
      this.photosUpdated.next(this.photoDisplay);
    }, error => {
      this.notificationService.notifyUser(error);
    });
  }

  addResultNotification(adds, errors) {
    this.notificationService.notifyUser(
      { success: this.messagingService.addPhotoSuccessMessage(adds),
        error: this.messagingService.addPhotoFailureMessage(errors)
      });
  }

  getPhotos(page) {
    const queryParams = `?count=${this.photoDisplay.count}&page=${page}`;
    this.httpClient.get<any>("http://localhost:3000/api/photos" + queryParams)
    .pipe( map(data => {
      return { photos: data.photos.map(photo => {
        return {
          url: photo.url,
          id: photo._id,
          creator: photo.creator
        };
      }),
      total: data.total
      };
    }))
    .subscribe((mappedData)=> {
      this.photoDisplay.photos = mappedData.photos;
      this.photoDisplay.total = mappedData.total;
      this.photoDisplay.page = page;
      this.photosUpdated.next(this.photoDisplay);
      this.updatePageNumber.next(page);
    });
  }

  deletePhotos = (selectedPhotos: Photo[]) => {
    this.httpClient.request<any>('delete', "http://localhost:3000/api/photos", { body: selectedPhotos })
      .subscribe((response)=> {
        let deletedPhotos = response.photos;
        this.deselectPhotos(deletedPhotos);
        this.getPhotos(this.getPageAfterDelete(response.count));
      }, error =>{

      });
  }

  getPageAfterDelete(deleteCount) {
    let maxPages = Math.ceil((this.photoDisplay.total - deleteCount)/this.photoDisplay.count);
    let newPage = this.photoDisplay.page > maxPages ? maxPages : this.photoDisplay.page;
    return newPage;
  }

  selectPhotos(photos: Photo[]) {
    this.selectedPhotos = concat(this.selectedPhotos, photos);
    this.selectedPhotosListener.next(this.selectedPhotos);
  }

  deselectPhotos(photos: Photo[]) {
    this.selectedPhotos = filter(this.selectedPhotos, (photo)=> { return !includes(_map(photos, "id"), photo.id)});
    this.selectedPhotosListener.next(this.selectedPhotos);
  }

  isSelected(id) {
    return _map(this.selectedPhotos, "id").includes(id);
  }

  downloadPhoto(url) {
    fileSaver.saveAs(url, url.split('/').pop());
  }

}
