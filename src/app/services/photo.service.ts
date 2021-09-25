import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of, Subject } from 'rxjs';
import { PhotoDisplayer } from '../models/photo-displayer.model';
import { catchError, map } from 'rxjs/operators';
import { concat } from 'lodash-es';
import { forEach } from 'lodash-es';
import { difference } from 'lodash-es';
import { includes } from 'lodash-es';
import { filter } from 'lodash-es';
import { map as _map } from 'lodash-es'

import * as fileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photoDisplay: PhotoDisplayer = {photos: [], total: 0, count: 10, page: 1};
  private photosUpdated = new Subject<PhotoDisplayer>();

  constructor(private httpClient: HttpClient) {
  }

  get PhotoUpdateListener() {
    return this.photosUpdated.asObservable();
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
        this.photoDisplay.photos = concat(this.photoDisplay.photos, mappedData.photos);
      });
      this.photoDisplay.total += forkedResponse.length;
      this.photosUpdated.next(this.photoDisplay);
    });
  }

  getPhotos(count: number, page: number) {
    const queryParams = `?count=${count}&page=${page}`;
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

  deletePhotos = (selectedPhotos: string[]) => {
    return new Promise(resolve => {
      this.httpClient.request<any>('delete', "http://localhost:3000/api/photos", { body: selectedPhotos }).subscribe((response)=> {
        let deletedPhotos = _map(response.photos, "id");
        this.photoDisplay.photos = filter(this.photoDisplay.photos, (photo) => { return !includes(deletedPhotos, photo.id)});
        this.photoDisplay.total -= deletedPhotos.length;
        this.photosUpdated.next(this.photoDisplay);
        resolve(deletedPhotos);
      });
    });
  }

  downloadPhoto(url) {
    fileSaver.saveAs(url, url.split('/').pop());
  }

}
