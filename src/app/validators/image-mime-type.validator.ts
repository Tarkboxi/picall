import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";
import * as concat from 'lodash/concat';

export const imageMimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  const JPEG_MIME_TYPE = ["ffd8ffe8", "ffd8ffe0", "ffd8ffe1", "ffd8ffe2", "ffd8ffe3"];
  const PNG_MIME_TYPE = ["89504e47"];
  const acceptedHeaders = concat(JPEG_MIME_TYPE, PNG_MIME_TYPE);
  const file = control.value as File;
  const fileReader = new FileReader();
  const fileReaderObservable = new Observable((observer: Observer<any>) => {
  fileReader.addEventListener("loadend", () => {
    const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);
    let header = "";
    for (let i=0; i<arr.length; i++) {
      header += arr[i].toString(16);
    }
    if(acceptedHeaders.includes(header)) {
      observer.next(null);
    } else {
      observer.next({invalidMimeType: true});
    }
    observer.complete();
  });
  fileReader.readAsArrayBuffer(file);
 });
 return fileReaderObservable;
}
