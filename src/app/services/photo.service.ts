import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Photo } from '../models/Photo.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photos: Photo[] = [];
  private photosUpdated = new Subject<Photo[]>();

  constructor(private httpClient: HttpClient) { }

  getPhotoUpdateListener() {
    return this.photosUpdated.asObservable();
  }

  addPhoto(data:FormData) {
    this.httpClient.post('http://localhost:3000/api/photos', data).subscribe((data)=>{
      return data;
     });
  }
}
