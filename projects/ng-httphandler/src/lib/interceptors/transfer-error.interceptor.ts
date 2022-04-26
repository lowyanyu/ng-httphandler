import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/internal/operators/catchError';
import { NgHttphandlerService } from '../services/ng-httphandler.service';


@Injectable()
export class TransferErrorInterceptor implements HttpInterceptor {

  constructor(
    private httpHandler: NgHttphandlerService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(resp => {
        const errorContext = this.httpHandler.parseContext(resp);
        return throwError(errorContext);
      })
    );
  }
}
