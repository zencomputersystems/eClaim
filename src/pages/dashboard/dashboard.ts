import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, NgModule, ElementRef, Inject, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule, Color } from 'ng2-charts/ng2-charts';
import { Chart } from 'chart.js';
//import 'chartjs-plugin-deferred';
import 'chart.piecelabel.js';
import 'rxjs/add/operator/map';
import * as constants from '../../config/constants';
import { Http } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupPage } from '../setup/setup';
/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  baseResourceUrl: string;
  baseResourceUrl_New:string;
  claimrequestdetails :any;
  Month_Change_ngModel :any;
  Year_Change_ngModel:any;
  month_value:any;
  year_value:any;
  CurrentMonthNumber:any;
  DashboardForm: FormGroup;
  years:any; years_data:any;

  constructor(public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.DashboardForm = fb.group({
      'Month': [null, Validators.compose([Validators.required])],
      'Year': [null, Validators.compose([Validators.required])]
    })
    this.baseResourceUrl_New = constants.DREAMFACTORY_TABLE_URL + '/vw_dashboardchart?filter=(USER_GUID =' + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    var current_date = new Date();
    this.month_value = current_date.getMonth();
    this.Month_Change_ngModel = this.month_value + 1;
    this.year_value = current_date.getFullYear();
    this.Year_Change_ngModel = this.year_value;
   
// console.log(this.baseResourceUrl_New)
    this.GetDashboardInfo();
    
    this.http
    .get(this.baseResourceUrl_New)
    .map(res => res.json())
    .subscribe(data => {
      this.years_data = data["resource"];
      console.log(this.years_data.length)
      
      if(this.years_data.length==0)
      {
        this.years=[this.year_value-1,this.year_value];
        //this.Year_Change_ngModel = this.year_value;
        //alert('No Records Found')
        // this.navCtrl.push(SetupPage);
        return;
      }
      else{}
      this.years =this.years_data;

 
      var uniqueYears = this.deduplicate(this.years);
      //console.log(uniqueYears)
      this.years =uniqueYears;
 
    var SortuniqueYears = this.sortUnique(this.years);
    //console.log(SortuniqueYears)
    this.years =SortuniqueYears;     
    });
  
  }
 // Unique and Sort years
 sortUnique(arr:any) {
  arr.sort();
  var last_i;
  for (var i=0;i<arr.length;i++)
      if ((last_i = arr.lastIndexOf(arr[i])) !== i)
          arr.splice(i+1, last_i-i);
  return arr;
}
 // Unique years
 deduplicate(data:any) {
  if (data.length > 0) {
      var result : any[]=[];      
      data.forEach(function (elem:any) {
          if (result.indexOf(elem.YEAR) === -1) {
              result.push(elem.YEAR);
          }
      });      
      return result;
  }
}
  ngOnInit() {
    // register plugin
    
    Chart.plugins.register({
      
      beforeDraw: function (chart:any) {
        var data = chart.data.datasets[0].data;
        var sum = data.reduce(function (a:any, b:any) {

          //return a.toFixed(2) + b.toFixed(2);
          // a=a.toFixed(2);
          // b=b.toFixed(2)
          var x = a + b;
          var y = parseFloat(x.toFixed(2));
          return y;

          //return Math.round(a + b);
          //   var x = a + b;
          //  var y = Math.round(x * 100)/100;
          //   var result= y.toFixed(2);
          //   return result;

        }, 0);
        var width = chart.chart.width,
          height = chart.chart.height,
          ctx = chart.chart.ctx;
        ctx.restore();
        var fontSize = (height / 14).toFixed(2);
        ctx.font = fontSize + "px Verdana";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "blue";
        if (sum != 0) {
        
          var text = sum,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

            // this.doughnutChartOptions =  {legend: {
            //   display: true,
            //   position: 'bottom'
            // },}
            // this.claimAmountOptions =  {legend: {
            //   display: true,
            //   position: 'bottom'
            // },}

    

        }
        else {
        text = 'Data Not Available', textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;
        }
        ctx.fillText(text, textX, textY);
        ctx.save();
      }

    });

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }
 //  ClaimsInfoChart
 public doughnutChartLabels: Array<string> = ['Approved', 'Pending', 'Rejected'];
 public doughnutChartData: Array<number> = [];

 public doughnutChartType: string = 'doughnut';
 public doughnutChartColors: any[] = [{ backgroundColor: ["#8BC34A", "orange", "red"] }];

 public chartClicked(e: any): void {
   console.log(e);
 }
 public chartHovered(e: any): void {
   console.log(e);
 }

 doughnutChartOptions = {
   // showInLegend : true,
   responsive: true,
   // centerText: true,
   legend: {
     display: true,
     position: 'bottom'
   },
   title: {
     display: true,
     text: 'Claim Count',
     fontSize: 20,
     fontColor: 'green'
   },
   pieceLabel: {
     mode: 'value',
 
     fontColor: ['green', 'white', 'red'],
     fontStyle: 'bold'
   },
 
   tooltips: {
     enabled: true,
     callbacks: {
       label: function (tooltipItem:any, data:any) {
         var label = data.labels[tooltipItem.index];
         var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
         return label + ' : ' + datasetLabel + ' ';
       }
     }
   },
 }

 // ClaimAmountChart
 public claimAmountLabels: Array<string> = ['Approved', 'Pending', 'Rejected'];
 public claimAmountData: Array<number> = [];
 public claimAmountChartType: string = 'doughnut';
 public claimAmountChartColors: any[] = [{ backgroundColor: ["#8BC34A", "orange", "red"] }];
 public claimAmountClicked(e: any): void {
   console.log(e);
 }
 public claimAmountHovered(e: any): void {
   console.log(e);
 }
 claimAmountOptions = {
   // showInLegend : true,
   responsive: true,
   // centerText: true,
   legend: {
     display: true,
     position: 'bottom'
   },
   title: {
     display: true,
     text: 'Claim Amount',
     fontSize: 20,
     fontColor: 'green'
   },
   pieceLabel: {
     mode: 'value',
     //fontColor:'blue',
     fontStyle: 'bold',
     fontColor: ['green', 'white', 'red'],
   },

   tooltips: {
     enabled: true,
     callbacks: {
       label: function (tooltipItem:any, data:any) {
         var label = data.labels[tooltipItem.index];
         var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
         return label + ' : ' + datasetLabel + ' ';
       }
     }
   },
 }

 Month_Changed(value:any) {
  //alert(value)
   this.month_value = value;
   this.GetDashboardInfo();
 }
 Year_Changed(value:any)
 {
   //alert(value)
  this.year_value = value;
  this.GetDashboardInfo();
 }
 GetDashboardInfo() {

   if (this.month_value != undefined) {
     this.baseResourceUrl = constants.DREAMFACTORY_TABLE_URL + '/vw_dashboardchart?filter=(USER_GUID =' + localStorage.getItem("g_USER_GUID") + ')and(MONTH=' + this.Month_Change_ngModel + ')and(YEAR=' + this.year_value + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
     console.log('hi '+this.baseResourceUrl)

   }


   this.http
     .get(this.baseResourceUrl)
     .map(res => res.json())
     .subscribe(data => {
       this.claimrequestdetails = data["resource"][0];
       //console.table(this.claimrequestdetails)
       if (data["resource"][0] != null) {
         var approve = parseInt(this.claimrequestdetails.ApprovedReqCount);
         var pending = parseInt(this.claimrequestdetails.PendingReqCount);
         var rejected = parseInt(this.claimrequestdetails.RejectedReqCount);
         this.doughnutChartData = [approve, pending, rejected];

         if (this.claimrequestdetails.ApprovedClaimAmount !== null && this.claimrequestdetails.ApprovedClaimAmount !== undefined) {
           var approveAmount = parseFloat(this.claimrequestdetails.ApprovedClaimAmount).toFixed(2);
         }
         else { approveAmount = '0' }
         if (this.claimrequestdetails.PendingClaimAmount !== null && this.claimrequestdetails.PendingClaimAmount !== undefined) {
           var pendingAmount = parseFloat(this.claimrequestdetails.PendingClaimAmount).toFixed(2);
         }
         else { pendingAmount = '0' }
         if (this.claimrequestdetails.RejectedClaimAmount !== null && this.claimrequestdetails.RejectedClaimAmount !== undefined) {
           var rejectedAmount = parseFloat(this.claimrequestdetails.RejectedClaimAmount).toFixed(2);
         }
         else { rejectedAmount = '0' }
     
         this.claimAmountData = [parseFloat(approveAmount), parseFloat(pendingAmount), parseFloat(rejectedAmount)];
       }
       else {
         approve = 0; 
          pending = 0;
          rejected = 0;
         this.doughnutChartData = [approve, pending, rejected];          
          pendingAmount = '0';
          rejectedAmount = '0';
          approveAmount = '0';

         this.claimAmountData = [parseFloat(approveAmount), parseFloat(pendingAmount), parseFloat(rejectedAmount)];

         this.doughnutChartLabels = data.label;
         this.claimAmountLabels = data.label;
         
       }
     });
 
    }
}
