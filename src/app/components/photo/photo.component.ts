import { Component, Input, OnInit } from '@angular/core';
import { Photo } from 'src/app/models/Photo.model';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  @Input() photo: Photo;
  constructor(private photoService: PhotoService) { }

  ngOnInit(): void {
  }

  like() {
    this.photoService.likePhoto(this.photo.id);
  }
}
