import { HandleContext } from '../models/handle-context.model';
import { HttpClientOption } from '../models/httpclient-option.model';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
export class NgHttphandlerService {

  constructor(
    private http: HttpClient
  ) { }

  public get(url: string, param?: {
    qParams?: { [key: string]: string | number },
    optionHeader?: { [header: string]: string }
  }): Observable<HandleContext | HandleContext[]> {
    const option = new HttpClientOption();
    if (param && param.optionHeader) {
      let optionheaders = new HttpHeaders();
      for (const key in param.optionHeader) {
        const value = param.optionHeader[key];
        optionheaders = optionheaders.set(key, value);
      }
      option.updatePartical({headers: optionheaders});
    }
    if (param && param.qParams) {
      let parameters = new HttpParams();
      for (const key in param.qParams) {
        const value = param.qParams[key] + '';
        parameters = parameters.set(key, value);
      }
      option.updatePartical({params: parameters});
    }
    return this.http
    .get<{ [header: string]: string | number | [] }>(url, option)
    .pipe(
      map(resp => this.handleSuccess(resp)),
      catchError(context => this.handleError(context))
    );

  }

  public post(url: string, body: { [key: string]: any }, param?: {
    optionHeader?: { [header: string]: string }
  }): Observable<HandleContext | HandleContext []> {
    const option = new HttpClientOption();
    if (param && param.optionHeader) {
      let optionheaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
      for (const key in param.optionHeader) {
        const value = param.optionHeader[key];
        optionheaders = optionheaders.append(key, value);
      }
      option.updatePartical({headers: optionheaders});
    }
    return this.http.post<{ [header: string]: string | number | [] }>(url, body, option).pipe(
      map(resp => this.handleSuccess(resp)),
      catchError(context => this.handleError(context))
    );
  }

  public handleSuccess(resp: { [header: string]: string | number | [] }) {
    if ( resp.errorCode === 0) {
      return this.parseContext(resp);
    } else {
      throw this.parseContext(resp);
    }
  }

  public handleError(errorContext: HandleContext | HandleContext[]) {
    return throwError(errorContext);
  }

  public parseContext(resp: any): HandleContext | HandleContext[] {
    let hcArray = new Array<HandleContext>();
    let respData = null;
    const hc = new HandleContext();
    hc.name = '';
    hc.time = new Date().getTime();
    hc.url = '';
    hc.status = 200;

    if (resp instanceof HttpErrorResponse) {
      hc.status = resp.status;
      hc.url = resp.url;
      if ( resp.error instanceof ErrorEvent) {
        hc.name = resp.error.filename;
        hc.errorCode =  -1;
        hc.errorMessage = resp.message || '????????????????????????';
        return hc;
      }
      if (resp.error instanceof ProgressEvent) {
        hc.name = 'ProgressEvent';
        hc.errorCode =  -1;
        hc.errorMessage = '????????????????????????Server ????????????????????????';
        return hc;
      }
      if (resp.error instanceof Object) {
        hc.name = 'Error';
        hc.errorCode = resp.error.errorCode || -1 ;
        hc.errorMessage =  resp.message || resp.error.errorMessage || '????????????????????????';
        respData = resp.error.data;
      }
    }
    /* Is HttpResponseError but got server errorCode and errorMessage.
     * And response status is 200, But errorCode is not 0.
     * And respoonse is success.
     */
    let isSplitResult = false;
    if (respData === undefined || respData === null) {
      respData = resp.data;
      hc.data = resp.data;
    }
    if ((respData && respData.amount) && respData.amount >= 1) {
      if (respData.result[0].errorCode !== undefined) {
        isSplitResult = true;
      }
    }
    if (isSplitResult) {
      const mutipleResp = respData.result;
      hcArray = mutipleResp.map((r: any) => {
        const tempHc = new HandleContext();
        tempHc.errorCode = r.errorCode;
        tempHc.errorMessage = r.errorMessage || '????????????????????????';
        tempHc.targetId = r.targetId;
        tempHc.targetName = r.targetName;
        return tempHc;
      });
    } else {
      hc.errorCode = (hc.errorCode === undefined) ? resp.errorCode : hc.errorCode;
      hc.errorMessage = (hc.errorMessage === undefined) ? resp.errorMessage || '????????????????????????' : hc.errorMessage;
    }
    return (hcArray.length > 0) ? hcArray : hc;
  }


}
