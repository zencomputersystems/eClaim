import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Component({

})

export class GlobalFunction {
  constructor(public alertCtrl: AlertController) {

  }

  showAlert_New(subTitle: string) {
    let alert = this.alertCtrl.create({
      title: 'e-Claim',
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  Random(): string {
    let rand = Math.random().toString(10).substring(2, 8)
    return rand;
  }
}