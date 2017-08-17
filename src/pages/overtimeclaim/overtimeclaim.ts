import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the OvertimeclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-overtimeclaim',
  templateUrl: 'overtimeclaim.html',
})
export class OvertimeclaimPage {
  OTform: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder) {

    this.OTform = fb.group({

      otname: '',

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OvertimeclaimPage');
  }

}
