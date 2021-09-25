import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, of, Subject } from 'rxjs';
import { PhotoDisplayer } from '../models/photo-displayer.model';
import { catchError, map } from 'rxjs/operators';
import { concat } from 'lodash-es';
import { forEach } from 'lodash-es';
import { difference } from 'lodash-es';
import { includes } from 'lodash-es';
import { filter } from 'lodash-es';
import { map as _map } from 'lodash-es'
import { take } from 'lodash-es'

import * as fileSaver from 'file-saver';
import { ThrowStmt } from '@angular/compiler';
import { Photo } from '../models/Photo.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photoDisplay: PhotoDisplayer = {photos: [], total: 0, count: 5, page: 1};
  private photosUpdated = new BehaviorSubject<PhotoDisplayer>(this.photoDisplay);
  private selectedPhotosListener = new Subject<Photo[]>();
  private selectedPhotos: Photo[] = [];

  constructor(private httpClient: HttpClient) {
  }

  get PhotoUpdateListener() {
    return this.photosUpdated.asObservable();
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
        })
      )
      uploads.push(upload);
    });
    forkJoin(uploads).subscribe((forkedResponse)=> {
      forEach(forkedResponse, (mappedData) => {
        this.photoDisplay.photos = concat(mappedData.photos, this.photoDisplay.photos);
      });
      this.photoDisplay.photos = take(this.photoDisplay.photos, this.photoDisplay.count);
      this.photoDisplay.total += forkedResponse.length;
      this.photosUpdated.next(this.photoDisplay);
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
      this.photosUpdated.next(this.photoDisplay);
    });
  }

  deletePhotos = (selectedPhotos: Photo[]) => {
    return new Promise(resolve => {
      this.httpClient.request<any>('delete', "http://localhost:3000/api/photos", { body: selectedPhotos }).subscribe((response)=> {
        let deletedPhotos = response.photos;
        this.photoDisplay.photos = filter(this.photoDisplay.photos, (photo) => { return !includes(_map(deletedPhotos, "id"), photo.id)});
        this.photoDisplay.total -= deletedPhotos.length;
        this.photosUpdated.next(this.photoDisplay);
        this.deselectPhotos(deletedPhotos);
        resolve(deletedPhotos);
      });
    });
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
