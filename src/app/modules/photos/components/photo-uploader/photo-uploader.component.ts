import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotoService } from 'src/app/services/photo/photo.service';

@Component({
  selector: 'app-photo-uploader',
  templateUrl: './photo-uploader.component.html',
  styleUrls: ['./photo-uploader.component.scss']
})
export class PhotoUploaderComponent {
  form: FormGroup;
  photoPreview: string;

  constructor(private readonly formBuiler: FormBuilder, private photoService: PhotoService) {
    this.form = this.formBuiler.group({
      photos: ['', [Validators.required]],
    });
  }

  photoSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    this.form.patchValue({photos: files});
    this.photoService.addPhotos(this.form.value.photos);
  }

}
