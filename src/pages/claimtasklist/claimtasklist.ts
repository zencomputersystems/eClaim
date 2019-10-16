import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Component } from '@angular/core';

/**
 * Generated class for the ClaimtasklistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claimtasklist',
  templateUrl: 'claimtasklist.html'
})
export class ClaimtasklistPage {

  role: any; month: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.role = "Validation";
    this.month = navParams.get("month");
    if (this.month != undefined) {
      this.month = this.month.substring(0, 3);
    }
    // console.log(this.month)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimtasklistPage');
  }
}
