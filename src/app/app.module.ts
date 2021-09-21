import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './components/auth/auth.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { PhotoUploaderComponent } from './components/photo-uploader/photo-uploader.component';
import { PhotoComponent } from './components/photo/photo.component';
import { PhotoGridComponent } from './components/photo-grid/photo-grid.component';
import { PhotoViewerComponent } from './components/photo/photo-viewer/photo-viewer.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    HeaderComponent,
    PhotoUploaderComponent,
    PhotoComponent,
    PhotoGridComponent,
    PhotoViewerComponent,
    SignupComponent,
    LoginComponent,
  ],
  entryComponents: [PhotoViewerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
