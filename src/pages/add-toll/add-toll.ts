import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';

import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { ClaimReqDetail_Model } from '../../models/ClaimReqDetail_Model';
import { UUID } from 'angular2-uuid';
import { Console } from '@angular/core/src/console';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
//import { TravelClaim_Service } from '../../services/travelclaim_service';
import { Services } from '../Services';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-add-toll',
  templateUrl: 'add-toll.html',  providers: [Services]
})
export class AddTollPage {
  paymentTypes: any; DetailsForm: any; ClaimMainGUID: any; ClaimMethodGUID: any;
  constructor(
    fb: FormBuilder,

    public api: Services, 

    public travelservice: Services, 

    public http: Http, public navCtrl: NavController, 
    public navParams: NavParams, public viewCtrl: ViewController
  ) 
  {


    // this.DetailsForm = fb.group({
    //   soc_no: '',
    //   project_name: '',
    //   travel_date: '',
    //   destination: ['', Validators.required],
    //   distance: ['', Validators.required],
    //   description: ['', Validators.required],
    //   origin: ['', Validators.required],
    //   amount: ['', Validators.required],
    //   vehicleType: ['', Validators.required]
    // });



   this.LoadPayments();
  }
  onLink(url: string) {
    window.open(url);
  }
  CloseAddTollPage() {
    this.viewCtrl.dismiss();
  }
  LoadPayments() {
    this.http
      .get(Services.getUrl('main_payment_type'))
      .map(res => res.json())
      .subscribe(data => {
        this.paymentTypes = data["resource"];
      }
      );
  }

  save() {
    let claimReqRef: ClaimReqDetail_Model = new ClaimReqDetail_Model();
    claimReqRef.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
    claimReqRef.CLAIM_REQUEST_GUID =this.ClaimMainGUID;
    claimReqRef.CLAIM_METHOD_GUID = this.ClaimMethodGUID;
      claimReqRef.PAYMENT_TYPE_GUID = this.PayType;
    claimReqRef.AMOUNT = this.Amount;
    claimReqRef.DESCRIPTION = this.Description;
    claimReqRef.CREATION_TS = new Date().toISOString();
    claimReqRef.UPDATE_TS = new Date().toISOString();


    this.api.postData('claim_request_detail', claimReqRef.toJson(true)).subscribe((response) => {

    this.travelservice.postData('claim_request_detail', claimReqRef.toJson(true)).subscribe((response) => {

      var postClaimRef = response.json();
      console.log(
        postClaimRef["resource"][0].CLAIM_REQUEST_DETAIL_GUID);

    })
  }

  ngOnInit():void{
   this.ClaimMainGUID =this.navParams.get('MainClaim');
   this.ClaimMethodGUID = this.navParams.get('ClaimMethod')
  }
  Amount: any; PayType: any; Description: any;
}
