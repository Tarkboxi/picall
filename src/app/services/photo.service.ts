import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PhotoDisplayer } from '../models/photo-displayer.model';
import { map } from 'rxjs/operators'
import { concat } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photoDisplay: PhotoDisplayer = {photos: [], total: 0};
  private photosUpdated = new Subject<PhotoDisplayer>();

  constructor(private httpClient: HttpClient) {
  }

  get PhotoUpdateListener() {
    return this.photosUpdated.asObservable();
  }

  addPhotos(title, photo) {
    let postData = new FormData();
    postData.append("title", title);
    postData.append("photo", photo);
    this.httpClient.post('http://localhost:3000/api/photos', postData).subscribe((data)=>{
      return data;
    });
  }

  getPhotos(count: number, page: number) {
    const queryParams = `?pagesize=${count}&page=${page}`;
    this.httpClient.get<any>("http://localhost:3000/api/photos" + queryParams)
    .pipe( map(data => {
      return { photos: data.photos.map(photo => {
        return {
          url: photo.url,
          id: photo._id
        };
      }),
      total: data.total
      };
    }))
    .subscribe((mappedData)=> {
      console.log(mappedData);
      this.photoDisplay.photos = mappedData.photos;
      this.photoDisplay.total = mappedData.total;
      this.photosUpdated.next(this.photoDisplay);
    });
  }

  deletePhotos(selectedPhotos: string[]) {
    console.log(selectedPhotos);
    this.httpClient.request<any>('delete', "http://localhost:3000/api/photos", { body: selectedPhotos }).subscribe((response)=> {
      let deletedPhotos = response.photos;
      this.photoDisplay.photos = this.photoDisplay.photos.filter( function( photo ) {
        return !(deletedPhotos.includes(photo.id));
      });
      this.photoDisplay.total -= deletedPhotos.length;
      this.photosUpdated.next(this.photoDisplay);
    });
  }

  likePhoto(id) {
  }
}
