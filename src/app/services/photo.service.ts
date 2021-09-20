import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PhotoDisplayer } from '../models/photo-displayer.model';

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
    this.httpClient.get<PhotoDisplayer>("http://localhost:3000/api/photos" + queryParams).subscribe((data)=> {
      this.photoDisplay.photos = data.photos;
      this.photoDisplay.total = data.total;
      this.photosUpdated.next(this.photoDisplay);
    });
  }

}
