import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the PrintclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-printclaim',
  templateUrl: 'printclaim.html',
})
export class PrintclaimPage {

    Printform: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder ) {

       this.Printform = fb.group({

      printname: '',

    });
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad PrintclaimPage');
  }

}
