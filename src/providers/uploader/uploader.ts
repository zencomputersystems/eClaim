import { RequestOptions, Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getURL } from '../sanitizer/sanitizer';
import { DREAMFACTORY_API_KEY } from '../../app/config/constants';
import { LoadingController, Loading } from 'ionic-angular';

/*
  Generated class for the UploaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UploaderProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UploaderProvider Provider');
  }

}

export function UploadImage(http: Http, filename: string, formControl: any) {
  /*   let loading: Loading;
    let loadingCtrl: LoadingController;
   */
  let result: any;
  const queryHeaders = new Headers();
  let uniqueName: string = new Date().getTime() + filename
  console.log("Unique Image Name: ", uniqueName);
  queryHeaders.append('filename', filename);
  queryHeaders.append('Content-Type', 'multipart/form-data');
  queryHeaders.append('fileKey', 'file');
  queryHeaders.append('chunkedMode', 'false');
  queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
  const options = new RequestOptions({ headers: queryHeaders });
  /*   loading = loadingCtrl.create(
      { content: 'Please wait...' });
    loading.present();
   */
  result = new Promise(resolve => http.post(getURL("image", uniqueName), formControl.value, options)
    .map((response: any) => {
      return response;
    }).subscribe((response: any) => {
      resolve(response.json());
    })
  )
  if (result) return uniqueName;
}