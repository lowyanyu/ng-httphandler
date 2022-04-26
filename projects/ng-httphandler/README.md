# NgHttphandler

v.2.0.0
This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

## Document
- NgHttpHandlerModule
- Services
  - [NgHttphandlerService](#NgHttphandlerService)
- Models
  - [HttpClientOption](#HttpClientOption)
  - [HandleContext](#HandleContext)
- Interceptors
  - [TransferErrorInterceptor](#TransferErrorInterceptor)

------------

### NgHttphandlerService

提供Http Clinet GET、POST 與 error handler success and error Method

#### Method

- [get](#get)
- [post](#post)
- [parseContext](#parseContext)
- [handleSuccess](#handleSuccess)
- [handleError](#handleError)

### get

透過 HTTP GET 取得遠端 JSON 資料的完整 HTTP 回應

`GETRequest(url: string, param:{qParams?: {[header: string]: string}, optionHeader?: {[header: string]: string}}): Observable<any>`

- Parameters
  - param: 型態 JSONObject，包含:  
      
          {
            url: 必填，型態為string，將此Request送往的位址
            qParams: 選填，型態為JSONObject，將作為HttpParameter
            optionHeader: 選填，型態為JSONObject，自定義的Request Header
          }
  - Return
    - Observable&lt;ErrorContext | ErrorContext[]&gt;

### post

透過 HTTP POST 取得遠端JSON資料的完整 HTTP 回應

`POSTRequest(url: string, param:{body?: {[header: string]: string}, optionHeader?: {[header: string]: string} = { 'Content-Type': 'application/json; charset=utf-8' }}): Observable<any>`

- Parameters
  - param: 型態 JSONObject，包含:  
      
          {
            url: 必填，型態為string，將此Request送往的位址
            body: 必填，型態為JSONObject，將作為 Request Body
            optionHeader: 選填，型態為JSONObject，自定義的Request Header，預設有{ 'Content-Type': 'application/json; charset=utf-8' }
          }
  - Return
    - Observable&lt;ErrorContext | ErrorContext[]&gt;


### parseContext

將Http 回應傳入並轉換為固定的資料格式

`parseContext(error: HandleContext | HandleContext[]): ErrorContext | ErrorContext[]`

- Parameters
  - error: 型態 any， 預轉換為ErrorContext 或 ErrorContext Array 的資料
  - Return
    - ErrorContext |  ErrorContext[]

### handleSuccess

判斷 Http 回應status 為 200，且回應中的 errorCode 是否為 0，並回傳其結果或拋出錯誤

`handleSuccess(resp: { [header: string]: string | number | [] }): ErrorContext | ErrorContext[]`

- Parameters
  - resp: 型態 any， 欲判斷 errorCode的 HTTP 回應
  - Return
    - ErrorContext |  JSONObject

### handleError

拋出 Http 回應status 不為 200 的 回應，並轉換成資料流

`handleError(errorContext: ErrorContext | ErrorContext[]): Observalbe<ErrorContext | ErrorContext[]>`

- Parameters
  - errorContext: 型態 ErrorContext| ErrorContext[]，欲拋出且已轉換為固定格式的回應
  - Return
    - errorContext: Observalbe<ErrorContext | ErrorContext[]>

------------
## Models

### HandleContext

HTTP 的回應將轉換成`HandleContext`格式

其包含下列屬性 : 

- name         :  類行為 string，表示錯誤名稱
- time         :  類行為 number，表示此Request 發生當下的timestamp
- url          :  類行為 string，表示此 Request url
- status       :  類行為 number，表示此 Http Response status
- errorCode    :  類行為 number，表示此 Http Response 中的 errorCode
- errorMessage :  類行為 string，表示此 Http Response 中的 errorMessage
- targetId     :  類行為 number，表示此 Http Response 作用的物件 Id
- targetName   :  類行為 string，表示此 Http Response 作用的物件名稱
- data         :  類行為 [header: string]: any，表示此 Http Response 的 data

### HttpClientOption

HTTP Request 的 option 參數
其包含下列屬性 : 

- headers        :  類行為 HttpHeaders 或 [header: string]: string | string[]，表示Http Request 的 Headers
- params         :  類行為 HttpParams 或 [param: string]: string | string[]，表示 Http Request 的 queryParameters


------------

## Interceptor

### TransferErrorInterceptor

攔截 HTTP Status 不為 200 的回應，並呼叫 `NgHttpHandlerService` [parseError](#parseError) 將其轉換為固定格式

------------

## Code scaffolding

Run `ng generate component component-name --project ng-httphandler` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project ng-httphandler`.
> Note: Don't forget to add `--project ng-httphandler` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build ng-httphandler` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build ng-httphandler`, go to the dist folder `cd dist/ng-httphandler` and run `npm publish`.

## Running unit tests

Run `ng test ng-httphandler` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
