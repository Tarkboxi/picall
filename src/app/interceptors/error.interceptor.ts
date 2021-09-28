import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from '../services/notification/notification.service';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.notificationService.setLoading(true);
    return next.handle(request).pipe(
      map<HttpEvent<any>, any>((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.notificationService.setLoading(false);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.setLoading(false);
        return throwError(error);
      })
    );
  };
}
