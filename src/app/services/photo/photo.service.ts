import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject, zip } from 'rxjs';
import { PhotoDisplayer } from '../../models/photo-displayer.model';
import { catchError } from 'rxjs/operators';
import { Photo } from '../../models/Photo.model';
import { NotificationService } from '../notification/notification.service';
import { MessagingService } from '../messaging/messaging.service';
import { ResponseHandlerService } from '../response-handler/response-handler.service';
import * as _ from '../../../utils/lodash-bundles';
import * as fileSaver from 'file-saver-es';
import { environment } from '../../../environments/environment';
import { UserNotification } from 'src/app/models/UserNotification.model';
const BACKEND_URL = environment.apiUrl+"/photos/";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photoDisplay: PhotoDisplayer = Object.assign({photos: [], total: 0, count: 20, page: 1});
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
      _.forEach(zippedResponse, (response) => {
        if(response.status == 201) {
          addedPhotos.push(response.body.data[0]);
        } else {
          errors.push(response);
        }
      });
      this.addResultNotification(addedPhotos.length, errors);
      this.getPhotos(this.photoDisplay.page);
    }, error => {
      this.responseHandler.handleErrorByStatus(error);
    });
  }

  getPhotos(page) {
    return new Promise(resolve => {
      const queryParams = `?count=${this.photoDisplay.count}&page=${page}`;
      this.httpClient.get<any>(BACKEND_URL + queryParams, { observe: 'response'})
      .subscribe((response)=> {
        let data = response.body.data;
        let mappedPhotos: Photo[] = this.mapPhotoFromDB(data);
        this.photoDisplay.photos = mappedPhotos;
        this.photoDisplay.total = response.body.total;
        this.photoDisplay.page = page;
        this.photosUpdated.next(this.photoDisplay);
        this.updatePageNumber.next(page);
        this.responseHandler.handleResponseByStatus(response, this.messagingService.photoFetchSuccess());
      }, error => {
        this.responseHandler.handleErrorByStatus(error);
      });
    });
  }

  deletePhotos = (selectedPhotos: Photo[]) => {
    this.httpClient.request<any>('delete', BACKEND_URL, { body: selectedPhotos, observe: 'response' },)
      .subscribe((response)=> {
        let deletedPhotos = response.body.data;
        this.deselectPhotos(deletedPhotos);
        this.responseHandler.handleResponseByStatus(response, this.messagingService.photoDeleteSuccess());
        this.getPhotos(this.getPageAfterDelete(response.body.count));
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
    this.selectedPhotos = _.concat(this.selectedPhotos, photos);
    this.selectedPhotosListener.next(this.selectedPhotos);
  }

  deselectPhotos(photos: Photo[]) {
    this.selectedPhotos = _.filter(this.selectedPhotos, (photo)=> { return !_.includes(_.map(photos, "id"), photo.id)});
    this.selectedPhotosListener.next(this.selectedPhotos);
  }

  isSelected(id) {
    return _.map(this.selectedPhotos, "id").includes(id);
  }

  downloadPhoto(url) {
    fileSaver.saveAs(url, this.getFileName(url));
  }

  getFileName(url) {
    let nameWithTimeStamp = url.split("/").pop();
    let brokenName = nameWithTimeStamp.split("-");
    brokenName.pop();
    return brokenName.join("");
  }

  mapPhotoFromDB(photos) {
    let mappedPhotos: Photo[] = [];
    _.forEach(photos, (photo) => {
      mappedPhotos.push(
        _.mapKeys(photo, function(value, key) {
            return key == '_id'? 'id' : key;
          })
      );
    });
    return mappedPhotos;
  }

  addResultNotification(adds, errors) {
    this.notificationService.notifyUserInfo( new UserNotification(
      { success: this.messagingService.addPhotoSuccessMessage(adds),
        error: this.messagingService.addPhotoFailureMessage(errors)
      }));
  }

  getZippedObservables(items, key) {
    let observables = []
    _.forEach(items, (item) => {
      let postData = new FormData();
      postData.append(key, item);
      let observable = this.httpClient.post<any>(BACKEND_URL, postData, { observe: 'response'})
      .pipe( catchError(error => of(error)));
      observables.push(observable);
    });
    return observables;
  }

}
