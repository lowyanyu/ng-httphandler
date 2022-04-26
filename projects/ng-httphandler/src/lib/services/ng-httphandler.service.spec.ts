import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { NgHttphandlerService } from './ng-httphandler.service';
import { HandleContext } from 'projects/ng-httphandler/src/lib/models/handle-context.model';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

const successNoData = require('@test-data/http-response/success-no-data.json');
const successWithData = require('@test-data/http-response/success-with-data.json');
const successWithResult = require('@test-data/http-response/success-with-result.json');
const successWithResults = require('@test-data/http-response/success-with-results.json');
const successWithListResult = require('@test-data/http-response/success-with-list-result.json');

const errorNoData = require('@test-data/http-response/error-no-data.json');
const errorWithResult = require('@test-data/http-response/error-with-result.json');
const errorWithResults = require('@test-data/http-response/error-with-results.json');
const error400 = require('@test-data/http-response/error-http-status-400.json');
const error401 = require('@test-data/http-response/error-http-status-401.json');
const error403 = require('@test-data/http-response/error-http-status-403.json');
const error404 = require('@test-data/http-response/error-http-status-404.json');
const error500 = require('@test-data/http-response/error-http-status-500.json');
const errorTimeout = require('@test-data/http-response/error-http-timeout.json');
const errorPotocol = require('@test-data/http-response/error-http-wrong-potocol.json');

describe('NgHttphandlerService', () => {
  let httpMock: HttpTestingController;
  let service: NgHttphandlerService;
  let apiRequest: TestRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NgHttphandlerService
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(NgHttphandlerService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function spySuccessHandler() {
    spyOn(service, 'handleSuccess').and.callThrough();
  }

  function spyErrorHandler() {
    spyOn(service, 'handleError').and.callThrough();
  }

  function expectHeader(header: { [key: string]: string}) {
    for (const key in header) {
      expect(apiRequest.request.headers.get(key)).toBe(header[key]);
    }
  }

  function expectHandleContext(response: HandleContext, orginData: any) {
    expect(response.errorCode).toBe(orginData.errorCode);
    expect(response.errorMessage).toBe(orginData.errorMessage);
    expect(response.data).toBe(orginData.data);
  }

  function expectHandleContextArray(response: HandleContext[], orginData: any) {
    expect((response).length).toBe(orginData.data.amount);
    response.forEach(r => {
      expect(r.errorCode).toBeDefined();
      expect(r.errorMessage).toBeDefined();
      expect(r.targetId).toBeDefined();
      expect(r.targetName).toBeDefined();
    });
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const parseType = 'HandleContext';

  describe(`#get testing`, () => {

    const url = `http://localhost:3000`;
    const urlWithParam = `http://localhost:3000?pageIndex=0&pageSize=0`;
    const queryParam = {pageIndex: 0, pageSize: 0};
    const header = {'Cache-Control': 'no-cache', 'Pragma': 'no-store'};


    function expectSuccessResponse(expectUrl: string, successData: JSON) {
      apiRequest = httpMock.expectOne(expectUrl);
      apiRequest.flush(successData);
      expect(apiRequest.request.method).toBe('GET');
      expect(service.handleSuccess).toHaveBeenCalled();
    }


    function expectErrorResponse(expectUrl: string, errorData: JSON) {
      apiRequest = httpMock.expectOne(expectUrl);
      apiRequest.flush(errorData);
      expect(apiRequest.request.method).toBe('GET');
      expect(service.handleError).toHaveBeenCalled();
    }

    describe(`[Postive]`, () => {
      beforeEach(() => {
        spySuccessHandler();
      });

      it('should send "GET" request to server and return success response with only `url` parameter', async(() => {
        service.get(url).subscribe({
          next: (response: HandleContext | HandleContext[]) => {
            expect((response as HandleContext).errorCode).toBe(0);
        }});
        expectSuccessResponse(url, successNoData);
      }));

      it('should send "GET" request to server and return success response with `url` and empty `option`', async(() => {
        service.get(url, {}).subscribe({
          next: (response: HandleContext | HandleContext[]) => {
            expect((response as HandleContext).errorCode).toBe(0);
        }});
        expectSuccessResponse(url, successNoData);
      }));

      it('should send "GET" request to server and return success response with `url` and `option` wich only query parameters', async(() => {
        service.get(url, {qParams: queryParam}).subscribe({
          next: (response: HandleContext | HandleContext[]) => {
            expect((response as HandleContext).errorCode).toBe(0);
        }});
        expectSuccessResponse(urlWithParam, successNoData);
      }));

      it('should send "GET" request to server and return success response with `url` and `option`', async(() => {
        service.get(url, {qParams: queryParam, optionHeader: header}).subscribe({
          next: (response: HandleContext | HandleContext[]) => {
            expect((response as HandleContext).errorCode).toBe(0);
        }});
        expectSuccessResponse(urlWithParam, successNoData);
        expectHeader(header);
      }));
    });

    describe(`[Negative]`, () => {
      beforeEach(() => {
        spyErrorHandler();
      });

      it('should send "GET" request to server and throw error response with `url`', async(() => {
        service.get(url).subscribe({
          next: () => {},
          error: error => {
            expect(error.constructor.name).toBe(parseType);
          }
        });
        expectErrorResponse(url, errorNoData);
      }));

      it('should send "GET" request to server and throw error response with `url` and empty `option`', async(() => {
        service.get(url).subscribe({
          next: () => {},
          error: error => {
            expect(error.constructor.name).toBe(parseType);
          }
        });
        expectErrorResponse(url, errorNoData);
      }));

      it('should send "GET" request to server and throw error response with `url` and `option` wich only query parameters', async(() => {
        service.get(url, {qParams: queryParam}).subscribe({
          next: () => {},
          error: error => {
            expect(error.constructor.name).toBe(parseType);
          }
        });
        expectErrorResponse(urlWithParam, errorNoData);
      }));

      it('should send "GET" request to server and throw error response with `url` and `option`', async(() => {
        service.get(url, {qParams: queryParam, optionHeader: header}).subscribe({
          next: () => {},
          error: error => {
            expect(error.constructor.name).toBe(parseType);
          }
        });
        expectErrorResponse(urlWithParam, errorNoData);
        expectHeader(header);
      }));
    });



  });

  describe(`#post testing`, () => {

    const url = `http://localhost:3000`;
    const body = {
      testKey: 'testVal'
    };
    const header = {'Cache-Control': 'no-cache', 'Pragma': 'no-store'};

    function expectSuccessResponse(expectUrl: string, expectBody: any, successData: JSON) {
      apiRequest = httpMock.expectOne(expectUrl);
      apiRequest.flush(successData);
      expect(apiRequest.request.method).toBe('POST');
      expect(apiRequest.request.body).toBe(expectBody);
      expect(service.handleSuccess).toHaveBeenCalled();
    }


    function expectErrorResponse(expectUrl: string, expectBody: any, errorData: JSON) {
      apiRequest = httpMock.expectOne(expectUrl);
      apiRequest.flush(errorData);
      expect(apiRequest.request.method).toBe('POST');
      expect(apiRequest.request.body).toBe(expectBody);
      expect(service.handleError).toHaveBeenCalled();
    }

    describe(`[Postive]`, () => {
      beforeEach(() => {
        spySuccessHandler();
      });

      it('should send "POST" request to server and return success response with `url` and `body`', async(() => {
        service.post(url, body).subscribe({
          next: (response: HandleContext | HandleContext[]) => {
            expect((response as HandleContext).errorCode).toBe(0);
        }});
        expectSuccessResponse(url, body, successNoData);
      }));


      it('should send "POST" request to server and return success response with `url`、`body` and empty `option`', async(() => {
        service.post(url, body, {}).subscribe({
          next: (response: HandleContext | HandleContext[]) => {
            expect((response as HandleContext).errorCode).toBe(0);
        }});
        expectSuccessResponse(url, body, successNoData);
      }));

      it('should send "POST" request to server and return success response with `url`、`body` and `option`', async(() => {
        service.post(url, body, {optionHeader: header}).subscribe({
          next: (response: HandleContext | HandleContext[]) => {
            expect((response as HandleContext).errorCode).toBe(0);
        }});
        expectSuccessResponse(url, body, successNoData);
        expectHeader(header);
      }));
    });

    describe(`[Negative]`, () => {
      beforeEach(() => {
        spyErrorHandler();
      });

      it('should send "POST" request to server and throw error response with `url` and `body`', async(() => {
        service.post(url, body).subscribe({
          next: () => {},
          error: error => {
            expect(error.constructor.name).toBe(parseType);
          }
        });
        expectErrorResponse(url, body, errorNoData);
      }));

      it('should send "POST" request to server and throw error response with `url`、`body`and empty `option`', async(() => {
        service.post(url, body, {}).subscribe({
          next: () => {},
          error: error => {
            expect(error.constructor.name).toBe(parseType);
          }
        });
        expectErrorResponse(url, body, errorNoData);
      }));

      it('should send "POST" request to server and throw error response with `url`、`body`and `option`', async(() => {
        service.post(url, body, {optionHeader: header}).subscribe({
          next: () => {},
          error: error => {
            expect(error.constructor.name).toBe(parseType);
          }
        });
        expectErrorResponse(url, body, errorNoData);
        expectHeader(header);
      }));
    });
  });

  describe(`#handleSuccess testing`, () => {
    describe(`[Postive]`, () => {
      it('should return response with success response wihch is no data', () => {
        const response = service.handleSuccess(successNoData);
        expectHandleContext((response as HandleContext), successNoData);
      });

      it('should return response with success response wihch is with data', () => {
        const response = service.handleSuccess(successWithData);
        expectHandleContext((response as HandleContext), successWithData);
      });

      it('should return response with success response wihch is with data which has result', () => {
        const response = service.handleSuccess(successWithResult);
        expectHandleContextArray((response as HandleContext[]), successWithResult);
      });

      it('should return response with success response wihch is with data which has mutiple result', () => {
        const response = service.handleSuccess(successWithResults);
        expectHandleContextArray((response as HandleContext[]), successWithResults);
      });

    });

    describe(`[Negative]`, () => {

      it('should throw errorContext with error response which is no data', () => {
        expect(() => service.handleSuccess(errorNoData)).toThrow();
      });

      it('should throw errorContext with error response which with result', () => {
        expect(() => service.handleSuccess(errorWithResult)).toThrow();
      });

      it('should throw errorContext with error response which with result', () => {
        expect(() => service.handleSuccess(errorWithResults)).toThrow();
      });

    });

  });

  describe(`#handleError testing`, () => {
    describe(`[Postive]`, () => {
      it('should throw errorContext', async(() => {
        service.handleError(new HandleContext()).subscribe({
          next: () => {},
          error: error => {
            expect(error).toEqual(new HandleContext());
          }
        });
      }));

      it('should throw errorContext', async(() => {
        const hArray = [new HandleContext(), new HandleContext()];
        service.handleError(hArray).subscribe({
          next: () => {},
          error: error => {
            expect(error).toBe(hArray);
          }
        });
      }));

    });
  });

  describe(`#parseContext testing`, () => {

    function expectHandleHTTPErrorResponse(response: HandleContext, orginData: HttpErrorResponse) {
      if (orginData.error.constructor.name === 'ProgressEvent') {
        expect(response.name).toBe('ProgressEvent');
        expect(response.errorCode).toBe(-1);
        expect(response.errorMessage).toBe('連線逾時，請檢查Server 是否可正常連線。');
      }
      if (orginData.error.constructor.name === 'ErrorEvent') {
        expect(response.name).toBe(orginData.error.filename);
        expect(response.errorCode).toBe(-1);
        expect(response.errorMessage).toBe(orginData.message || '無可用的錯誤訊息');
      }
      if (orginData.error.constructor.name === 'Object') {
        expect(response.name).toBe('Error');
        expect(response.errorCode).toBe(orginData.error.errorCode || -1);
        expect(response.errorMessage).toBe(orginData.message || orginData.error.errorMessage || '無可用的錯誤訊息');
      }
      expect(response.status).toBe(orginData.status);
      expect(response.url).toBe(orginData.url);
    }

    describe(`[Postive]`, () => {
      it('should return HandleContext with param wihch is no data', () => {
        const response = service.parseContext(successNoData);
        expectHandleContext(response as HandleContext, successNoData);
      });

      it('should return HandleContext with param wihch is with data', () => {
        const response = service.parseContext(successWithData);
        expectHandleContext(response as HandleContext, successWithData);
      });

      it('should return HandleContext array with param wihch is with data which has result', () => {
        const response = service.parseContext(successWithResult);
        expectHandleContextArray(response as HandleContext[], successWithResult);
      });

      it('should return HandleContext array with param wihch is with data which has mutiple result and should split', () => {
        const response = service.parseContext(successWithResults);
        expectHandleContextArray(response as HandleContext[], successWithResults);
      });

      it('should return HandleContext array with param wihch is with data which has mutiple result but no split', () => {
        const response = service.parseContext(successWithListResult);
        expectHandleContext(response as HandleContext, successWithListResult);
      });

    });

    describe(`[Negative]`, () => {

      it('should return HandleContext with param wihch is no data', () => {
        const response = service.parseContext(errorNoData);
        expectHandleContext(response as HandleContext, errorNoData);
      });

      it('should return HandleContext with param wihch is 400', () => {
        const errorHttpResponse = new HttpErrorResponse(error400);
        const response = service.parseContext(errorHttpResponse);
        expectHandleHTTPErrorResponse(response as HandleContext, errorHttpResponse);
      });

      it('should return HandleContext with param wihch is 401', () => {
        const errorHttpResponse = new HttpErrorResponse(error401);
        const response = service.parseContext(errorHttpResponse);
        expectHandleHTTPErrorResponse(response as HandleContext, errorHttpResponse);
      });

      it('should return HandleContext with param wihch is 403', () => {
        const errorHttpResponse = new HttpErrorResponse(error403);
        const response = service.parseContext(errorHttpResponse);
        expectHandleHTTPErrorResponse(response as HandleContext, errorHttpResponse);
      });

      it('should return HandleContext with param wihch is 404', () => {
        const errorHttpResponse = new HttpErrorResponse(error404);
        const response = service.parseContext(errorHttpResponse);
        expectHandleHTTPErrorResponse(response as HandleContext, errorHttpResponse);
      });

      it('should return HandleContext with param wihch is 500', () => {
        const errorHttpResponse = new HttpErrorResponse(error500);
        const response = service.parseContext(errorHttpResponse);
        expectHandleHTTPErrorResponse(response as HandleContext, errorHttpResponse);
      });

      it('should return HandleContext with param wihch is timeout', () => {
        const errorHttpResponse = new HttpErrorResponse(
          { error: new ProgressEvent(errorTimeout.error),
            headers: new HttpHeaders(errorTimeout.headers),
            status: errorTimeout.status,
            url: errorTimeout.url,
            statusText: errorTimeout.statusText});

        const response = service.parseContext(errorHttpResponse);
        expectHandleHTTPErrorResponse(response as HandleContext, errorHttpResponse);
      });

      it('should return HandleContext with param wihch is wrong potocol', () => {
        const errorHttpResponse = new HttpErrorResponse(
          { error: new ProgressEvent(errorPotocol.error),
            headers: new HttpHeaders(errorPotocol.headers),
            status: errorPotocol.status,
            url: errorPotocol.url,
            statusText: errorPotocol.statusText});

        const response = service.parseContext(errorHttpResponse);
        expectHandleHTTPErrorResponse(response as HandleContext, errorHttpResponse);
      });

      it('should return HandleContext array with param wihch is with data which has result', () => {
        const response = service.parseContext(errorWithResult);
        expectHandleContextArray(response as HandleContext[], errorWithResult);
      });

      it('should return HandleContext array with param wihch is with data which has mutiple result', () => {
        const response = service.parseContext(errorWithResults);
        expectHandleContextArray(response as HandleContext[], errorWithResults);
      });

    });


  });

});
