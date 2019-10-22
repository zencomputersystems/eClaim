import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the ToastProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToastProvider {
  constructor(public toastCtrl: ToastController) { }
  
  presentToast(textmsg: string, msduration: number = 3000) {
    const toast = this.toastCtrl.create({
      message: textmsg,
      duration: msduration,
      position: 'top'
    });
    toast.present();
  }

}
