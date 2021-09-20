import { Component, Input, OnInit } from '@angular/core';
import { Photo } from 'src/app/models/Photo.model';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  @Input() photo: Photo;
  constructor() { }

  ngOnInit(): void {
  }

}
