import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SubmodulesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-submodulesetup',
  templateUrl: 'submodulesetup.html',
})
export class SubmodulesetupPage {
  public AddSubModuleClicked: boolean = false; 
  public AddSubModuleClick() {

      this.AddSubModuleClicked = true; 

  }

  public CloseSubModuleClick() {

    if (this.AddSubModuleClicked == true) {
      this.AddSubModuleClicked = false;
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmodulesetupPage');
  }

}
