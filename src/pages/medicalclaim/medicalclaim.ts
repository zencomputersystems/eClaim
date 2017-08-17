import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';


/**
 * Generated class for the MedicalclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-medicalclaim',
  templateUrl: 'medicalclaim.html',
})
export class MedicalclaimPage {
  Mcform: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder ) {
    this.Mcform = fb.group({

      mcname: '',

    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicalclaimPage');
  }

}
