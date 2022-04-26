import { HttpHeaders, HttpParams } from "@angular/common/http";

export class HttpClientOption {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  constructor(init?: Partial<HttpClientOption>) {
    Object.assign(this, init);
  }

  updatePartical(init: Partial<HttpClientOption>) {
    Object.assign(this, init);
  }
}
