import { Component, Input, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ClaimReportPrintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claim-report-print',
  templateUrl: 'claim-report-print.html',
})
export class ClaimReportPrintPage {

  @Input() claimsListPrint: any[];
  @Input() claimsListSummary: any[];
  @Input() empData: any;
  @Input() year: any;
  @Input() month: any;
  @Input() totalClaimAmount: number;
  @Input() claimsSocSummary: any[];
  currency = localStorage.getItem("cs_default_currency")
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   // this.getSocSummary();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimReportPrintPage');
  }
  // ionViewWillEnter()
  // {
  //   this.getSocSummary();
  // }

  // ngOnInit()
  // {
  //   this.getSocSummary();
  // }
  // ngAfterContentInit()
  // {
  //   this.getSocSummary();
  // }
  // ngAfterViewInit()
  // {
  //   this.getSocSummary();
  // }
  // getSocSummary() {
  //   if (this.claimsListPrint.length != 0) {
  //     this.claimsListPrint.forEach(element => {

  //       if (element.SOC_GUID != null && this.claimsSocSummary.find(e => e.SOC_GUID == element.SOC_GUID) === undefined) {
  //         this.claimsSocSummary.push([{ "SOC_GUID": element.SOC_GUID, "SOC": element.SOC, "Total": element.Total }]);
  //       }
  //       else if (element.CUSTOMER_GUID != null && this.claimsSocSummary.find(e => e.SOC_GUID == element.CUSTOMER_GUID) === undefined) {
  //         this.claimsSocSummary.push([{ "SOC_GUID": element.CUSTOMER_GUID, "SOC": element.CUSTOMER_NAME, "Total": element.Total }]);
  //       }
  //       else {
  //         if (element.SOC_GUID != null)
  //           this.claimsSocSummary.find(e => e.SOC_GUID === element.SOC_GUID).Total += element.Total;
  //         else
  //           this.claimsSocSummary.find(e => e.SOC_GUID === element.CUSTOMER_GUID).Total += element.Total;
  //       }
  //     });
  //   }
  // }
}
