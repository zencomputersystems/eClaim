import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the GiftclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-giftclaim',
  templateUrl: 'giftclaim.html',
})
export class GiftclaimPage {
    Giftform: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder) {
           this.Giftform = fb.group({

      giftname: '',

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftclaimPage');
  }

}
