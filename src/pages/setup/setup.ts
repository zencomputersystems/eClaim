import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BanksetupPage } from '../banksetup/banksetup';
import { BranchsetupPage } from '../branchsetup/branchsetup';
import { CashcardsetupPage } from '../cashcardsetup/cashcardsetup';
import { ClaimtypePage } from '../claimtype/claimtype';
import { CompanysetupPage } from '../companysetup/companysetup';
import { DesignationsetupPage } from '../designationsetup/designationsetup';
import { DepartmentsetupPage } from '../departmentsetup/departmentsetup';
import { MileagesetupPage } from '../mileagesetup/mileagesetup';
import { PaymenttypesetupPage } from '../paymenttypesetup/paymenttypesetup';
import { QualificationsetupPage } from '../qualificationsetup/qualificationsetup';
import { SubsciptionsetupPage } from '../subsciptionsetup/subsciptionsetup';
import { RolesetupPage } from '../rolesetup/rolesetup';
import { TenantsetupPage } from '../tenantsetup/tenantsetup';
import { UserPage } from '../user/user'
/**
 * Generated class for the SetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToBanksetup(){
    this.navCtrl.push(BanksetupPage)
  }

  goToBranchsetup(){
    this.navCtrl.push(BranchsetupPage)
  }

    goToCashcardsetup(){
    this.navCtrl.push(CashcardsetupPage)
  }


    goToClaimtypesetup(){
    this.navCtrl.push(ClaimtypePage)
  }

  goToUser(){
    this.navCtrl.push(UserPage)
  }
  
  goToCompanysetup(){
    this.navCtrl.push(CompanysetupPage)
  }

  goToDesignationsetup(){
    this.navCtrl.push(DesignationsetupPage)
  }

  goToDepartmentsetup(){
    this.navCtrl.push(DepartmentsetupPage)
  }

 

      goToPaymenttypesetup(){
    this.navCtrl.push(PaymenttypesetupPage)
  }


      goToSubscriptionsetup(){
    this.navCtrl.push(SubsciptionsetupPage)
  }

      goToQualificationsetup(){
    this.navCtrl.push(QualificationsetupPage)
  }

      goToRolesetup(){
    this.navCtrl.push(RolesetupPage)
  }

    goToTenantsetup(){
    this.navCtrl.push(TenantsetupPage)
  }
      goToMileagesetup(){
    this.navCtrl.push(MileagesetupPage)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupPage');
  }

}
