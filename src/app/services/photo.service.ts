import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject, zip } from 'rxjs';
import { PhotoDisplayer } from '../models/photo-displayer.model';
import { catchError, map } from 'rxjs/operators';
import { concat } from 'lodash-es';
import { forEach } from 'lodash-es';
import { includes } from 'lodash-es';
import { filter } from 'lodash-es';
import { map as _map } from 'lodash-es';
import { mapKeys } from 'lodash-es';
import { take } from 'lodash-es';
import * as fileSaver from 'file-saver';
import { Photo } from '../models/Photo.model';
import { NotificationService } from './notification.service';
import { MessagingService } from './messaging.service';
import { ResponseHandlerService } from './response-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photoDisplay: PhotoDisplayer = {photos: [], total: 0, count: 5, page: 1};
  private photosUpdated = new BehaviorSubject<PhotoDisplayer>(this.photoDisplay);
  private selectedPhotosListener = new Subject<Photo[]>();
  private selectedPhotos: Photo[] = [];
  private updatePageNumber = new Subject<number>();

  constructor(private httpClient: HttpClient, private notificationService: NotificationService, private messagingService: MessagingService, private responseHandler: ResponseHandlerService) {
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
    const uploads = this.getZippedObservables(photos, "photo");
    zip(...uploads).subscribe((zippedResponse)=> {
      let errors = [];
      let addedPhotos = [];
      forEach(zippedResponse, (eachResponse) => {
        if(eachResponse.status == 201) {
          addedPhotos.push(eachResponse.body.photos[0]);
        } else {
          errors.push(eachResponse);
        }
      });
      if(this.photoDisplay.page == 1) {
        this.photoDisplay.photos = concat(this.mapPhotoFromDB(addedPhotos), this.photoDisplay.photos);
      }
      if(this.photoDisplay.photos.length > this.photoDisplay.count) {
        this.photoDisplay.photos = take(this.photoDisplay.photos, this.photoDisplay.count);
      }
      this.photoDisplay.total += addedPhotos.length;
      this.photosUpdated.next(this.photoDisplay);
      this.addResultNotification(addedPhotos.length, errors);
    }, error => {
      this.responseHandler.handleErrorByStatus(error);
    });
  }

  getZippedObservables(items, key) {
    let observables = []
    forEach(items, (item) => {
      let postData = new FormData();
      postData.append(key, item);
      let observable = this.httpClient.post<any>('http://localhost:3000/api/photos', postData, { observe: 'response'})
      .pipe( catchError(error => of(error)));
      observables.push(observable);
    });
    return observables;
  }

  getPhotos(page) {
    const queryParams = `?count=${this.photoDisplay.count}&page=${page}`;
    this.httpClient.get<any>("http://localhost:3000/api/photos" + queryParams, { observe: 'response'})
    .subscribe((httpResponse)=> {
      let data = httpResponse.body;
      let mappedPhotos: Photo[] = this.mapPhotoFromDB(data.photos);
      this.photoDisplay.photos = mappedPhotos;
      this.photoDisplay.total = data.total;
      this.photoDisplay.page = page;
      this.photosUpdated.next(this.photoDisplay);
      this.updatePageNumber.next(page);
      this.responseHandler.handleResponseByStatus(httpResponse);
    }, error => {
      this.responseHandler.handleErrorByStatus(error);
    });
  }

  deletePhotos = (selectedPhotos: Photo[]) => {
    this.httpClient.request<any>('delete', "http://localhost:3000/api/photos", { body: selectedPhotos })
      .subscribe((response)=> {
        let deletedPhotos = response.photos;
        this.deselectPhotos(deletedPhotos);
        this.getPhotos(this.getPageAfterDelete(response.count));
      }, error => {
        this.responseHandler.handleErrorByStatus(error);
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

  private mapPhotoFromDB(photos) {
    let mappedPhotos: Photo[] = [];
    forEach(photos, (photo) => {
      mappedPhotos.push(
        mapKeys(photo, function(value, key) {
            return key == '_id'? 'id' : key;
          })
      );
    });
    return mappedPhotos;
  }

  addResultNotification(adds, errors) {
    this.notificationService.notifyUser(
      { success: this.messagingService.addPhotoSuccessMessage(adds),
        error: this.messagingService.addPhotoFailureMessage(errors)
      });
  }

}
