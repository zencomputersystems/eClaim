import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';

/**
 * Generated class for the UploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {

  @ViewChild('fileInput') fileInput: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }  

  ngOnInit() {
  }

  // private upload() {
  //   const fileBrowser = this.fileInput.nativeElement;
  //   if (fileBrowser.files && fileBrowser.files[0]) {
  //     const formData = new FormData();
  //     formData.append('files', fileBrowser.files[0]);
  //     const xhr = new XMLHttpRequest();
  //     xhr.open('POST', 'http://api.zen.com.my/api/v2/azurefs/', true);
  //     xhr.onload = function () {
  //       if (this['status'] === 200) {
  //           const responseText = this['responseText'];
  //           const files = JSON.parse(responseText);
  //           //todo: emit event
  //       } else {
  //         //todo: error handling
  //       }
  //     };
  //     xhr.send(formData);
  //   }
  // }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }

}

