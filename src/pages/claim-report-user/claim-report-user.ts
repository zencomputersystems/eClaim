import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { getURL } from '../../providers/sanitizer/sanitizer';
/**
 * Generated class for the ClaimReportUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claim-report-user',
  templateUrl: 'claim-report-user.html',
})
export class ClaimReportUserPage {
  monthsList: any[] = [];
  monthsData: any[];
  claimsList: any[];
  claimsListPrint: any[];
  claimsListPrintTemp: any[] = [];
  totalClaimAmount: number = 0;
  loginUserGuid: string;
  month: string;
  year: string;
  empData: any;
  baseResourceUrlSummary: string;
  claimsListSummary: any[];
  claimsSocSummary: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private alertCtrl: AlertController) {
    this.loginUserGuid = localStorage.getItem("g_USER_GUID");
    this.BindMonths();
    this.BindEmpDetails();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimReportUserPage');
  }



  BindData(printSectionId: any, item: string) {
    if (this.loginUserGuid !== undefined) {
      this.month = item.split(' ')[0].substring(0, 3);
      //alert(this.month);
      this.year = item.split(' ')[1];
      console.log(getURL("table", "vw_claim_report",[`USER_GUID=${this.loginUserGuid}`, `MONTH=${this.month}`, `YEAR=${this.year}`],"AND"));
      this.http
        .get(getURL("table", "vw_claim_report",[`USER_GUID=${this.loginUserGuid}`, `MONTH=${this.month}`, `YEAR=${this.year}`],"AND"))
        .map(res => res.json())
        .subscribe(data => {
          this.claimsListPrint = data["resource"];
          this.totalClaimAmount = 0;
          this.claimsListPrintTemp = [];
          this.claimsList = this.claimsListPrint;
          this.totalClaimAmount = 0;
          this.claimsListPrint.forEach(element => {
            element.TRAVEL_DATE = new Date(element.TRAVEL_DATE.replace(/-/g, "/"))
            if (element.TYPE === 'TRV') {
              element.RowNum = "1";
              this.claimsListPrintTemp.push(element);
              for (let i = 2; i <= 7; i++) {
                let flag = false;
                if (i <= 3)
                  flag = true;
                else if (i == 4 && element.TollAmount != 0)
                  flag = true;
                else if (i == 5 && element.ParkingAmount != 0)
                  flag = true;
                else if (i == 6 && element.MealAmount != 0)
                  flag = true;
                else if (i == 7 && element.AccAmount != 0)
                  flag = true;
                if (flag) {
                  const myClonedObject = Object.assign({}, element);
                  myClonedObject.RowNum = i.toString();
                  this.claimsListPrintTemp.push(myClonedObject);
                }
              }
            }
            else if (element.TYPE === 'OT') {
              element.RowNum = "1";
              this.claimsListPrintTemp.push(element);
              for (let i = 2; i <= 4; i++) {
                const myClonedObject = Object.assign({}, element);
                myClonedObject.RowNum = i.toString();
                this.claimsListPrintTemp.push(myClonedObject);
              }
            }
            else {
              element.RowNum = "1";
              this.claimsListPrintTemp.push(element);
              const myClonedObject = Object.assign({}, element);
              myClonedObject.RowNum = "2";
              this.claimsListPrintTemp.push(myClonedObject);
            }

            this.totalClaimAmount = this.totalClaimAmount + element.Total;
          });
        });
      this.BindSummaryData();
      this.GetSocSummaryData();
    }
    let alert1 = this.alertCtrl.create({
      title: 'Print Report',
      message: 'Printable report ready. Please click OK to continue.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            return
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.printToCart(printSectionId);
          }
        }
      ]
    })
    alert1.present();
  }
  BindEmpDetails() {
    this.http
      .get(getURL("table","view_user_display",[`USER_GUID=${this.loginUserGuid}`]))
      .map(res => res.json())
      .subscribe(data => {
        this.empData = data["resource"];
      });
  }

  BindSummaryData() {
    this.http
      .get(getURL("table","vw_claim_report_summary",[`USER_GUID=${this.loginUserGuid}`,`MONTH=${this.month}`,`YEAR=${this.year}`],"AND"))
      .map(res => res.json())
      .subscribe(data => {
        this.claimsListSummary = data["resource"];
      });
  }

  GetSocSummaryData() {
    this.http
      .get(getURL("table","vw_claim_report_soc_summary",[`USER_GUID=${this.loginUserGuid}`,`MONTH=${this.month}`,`YEAR=${this.year}`],"AND"))
      .map(res => res.json())
      .subscribe(data => {
        this.claimsSocSummary = data["resource"];
      });
  }

  printToCart(printSectionId: any) {
    // let part = this.el.nativeElement.querySelector(printSectionId);
    // this.renderer.setElementStyle(part, 'display', 'block');
    // this.renderer;
    // window.onload;
    document.getElementById(printSectionId).hidden = false;
    var innerContents = document.getElementById(printSectionId).innerHTML;
    var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
    document.getElementById(printSectionId).hidden = true;
  }

  BindMonths() {
    let i = 1;
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();
    if (this.loginUserGuid !== undefined) {
      this.http
        .get(getURL("table","vw_get_months",[`USER_GUID=${this.loginUserGuid}`]))
        .map(res => res.json())
        .subscribe(data => {
          this.monthsData = data["resource"];
          this.monthsData.forEach(element => {
            if (i <= 12 && ((element.year == currentYear && element.MONTHNUM <= currentMonth) || (element.year == currentYear - 1 && element.MONTHNUM > currentMonth))) {
              let item = element.MONTH_NAME + ' ' + element.year;
              this.monthsList.push(item);
              i++;
            }
          });

        });
    }
  }
}
