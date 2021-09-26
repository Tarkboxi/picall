import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { PhotoGridComponent } from './components/photo-grid/photo-grid.component';
import { PhotoControlComponent } from './components/photo-control/photo-control.component';
import { PageTrackerComponent } from './components/page-tracker/page-tracker.component';
import { PhotoUploaderComponent } from './components/photo-uploader/photo-uploader.component';
import { PhotoComponent } from './components/photo/photo.component';
import { PhotoViewerComponent } from './components/photo/photo-viewer/photo-viewer.component';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    PhotoGridComponent,
    PhotoControlComponent,
    PageTrackerComponent,
    PhotoUploaderComponent,
    PhotoComponent,
    PhotoViewerComponent,
  ],
  entryComponents: [PhotoViewerComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ]
})
export class PhotosModule { }
