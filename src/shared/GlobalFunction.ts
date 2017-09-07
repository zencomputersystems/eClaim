import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@Component({
 
})

export class GlobalFunction {
 constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {  
   }
 
 showAlert_New(subTitle: string) {
    let alert = this.alertCtrl.create({
      title: 'e-Claim',
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }
}