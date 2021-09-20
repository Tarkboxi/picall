import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotoService } from 'src/app/services/photo.service';
import { imageMimeType } from 'src/app/validators/image-mime-type.validator';

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
      photo: ['', [Validators.required], [imageMimeType]],
      title: ['', Validators.maxLength(20)],
    });
  }

  photoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({photo: file});
    this.form.get('photo').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  upload() {
    this.photoService.addPhoto(this.form.value);
  }

}
