import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the TravelclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-travelclaim',
  templateUrl: 'travelclaim.html',
})
export class TravelclaimPage {
  Travelform: FormGroup;
  public AddTravelClicked: boolean = false;

  public AddTravelClick() {

    this.AddTravelClicked = true;
  }

  public CloseTravelClick() {

    this.AddTravelClicked = false;
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,fb:FormBuilder) {
    this.Travelform = fb.group({

      travelname: '',

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelclaimPage');
  }

}
