import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgHttphandlerService } from 'projects/ng-httphandler/src/lib/services/ng-httphandler.service';
import { TransferErrorInterceptor } from './transfer-error.interceptor';

const error400 = require('@test-data/http-response/error-http-status-400.json');

describe('TransferErrorInterceptor', () => {
  let service: NgHttphandlerService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TransferErrorInterceptor,
        NgHttphandlerService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TransferErrorInterceptor,
          multi: true,
        }
      ]
    });
    service = TestBed.inject(NgHttphandlerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  const parseType = 'HandleContext';

  it('should be created', () => {
    const interceptor: TransferErrorInterceptor = TestBed.inject(TransferErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should call NgHttphandlerService `parseContext` method ', () => {
    const url = 'http://localhost:3000';
    service.get(url).subscribe({
      next: () => {},
      error : error => {
        expect(error.constructor.name).toBe(parseType);
      }
    });
    const apiRequest = httpMock.expectOne(url);
    apiRequest.flush(error400, {
      status: 401,
      statusText: 'Bad Request'
    });
    expect(apiRequest.request.method).toBe('GET');
  });
});
