import { ApiModelProvider } from './../api-model/api-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CustomerListProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CustomerListProvider {

  constructor(public http: HttpClient, apiModel: ApiModelProvider) {
    console.log('Hello CustomerListProvider Provider');
    console.log("Test:", apiModel.getApiModel("view_customer"));
  }


}
