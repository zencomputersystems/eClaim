import { IonicPage, NavController, NavParams,LoadingController,Loading, Config } from 'ionic-angular';
import { Component, NgModule, ElementRef, Inject, ViewChild, OnChanges } from '@angular/core';
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
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DecimalPipe } from "@angular/common";

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html', providers: [DecimalPipe]
})
export class DashboardPage {
  baseResourceUrl: string;
  baseResourceUrl_New: string;
  claimrequestdetails: any;
  Month_Change_ngModel: any;
  Year_Change_ngModel: any;
  month_value: any;
  year_value: any;
  CurrentMonthNumber: any;
  DashboardForm: FormGroup;
  years: any; years_data: any;
  Rejected_Claim_Count = 0; Rejected_Claim_Amount = '0.00';
  Pending_Claim_Count = 0; Pending_Claim_Amount = '0.00';
  Approved_Claim_Count = 0; Approved_Claim_Amount = '0.00';
  baseResourceUrl_Card: any; Year_Card: any;
  RejectedClaimCount_year: any;PendingClaimCount_year: any;ApprovedClaimCount_year: any;
  PaidClaimCount_year:any;
  PaidReqCount= 0;
  PendingClaimAmount_year: any; RejectedClaimAmount_year: any;ApprovedClaimAmount_year: any;
  PaidClaimAmount = '0.00';
  PaidClaimAmount_year:any;
  loading: Loading;
  constructor(public numberPipe: DecimalPipe,public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public http: Http, public config: Config,
    public inAppBrowser: InAppBrowser, private loadingCtrl: LoadingController) {
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
    this.GetInfoForCards();
    this.GetData_Years();
  }
  // Unique and Sort years
  sortUnique(arr: any) {
    arr.sort();
    var last_i;
    for (var i = 0; i < arr.length; i++)
      if ((last_i = arr.lastIndexOf(arr[i])) !== i)
        arr.splice(i + 1, last_i - i);
    return arr;
  }
  // Unique years
  deduplicate(data: any) {
    if (data.length > 0) {
      var result: any[] = [];
      data.forEach(function (elem: any) {
        if (result.indexOf(elem.YEAR) === -1) {
          result.push(elem.YEAR);
        }
      });
      return result;
    }
  }
  
  // ngOnInit() {     
  //   // this.loading = this.loadingCtrl.create({
  //   //   content: 'Loading...',
  //   // });
  //   // this.loading.present();  
  //   // register plugin       
  //   Chart.plugins.register({     
  //     beforeDraw: function (chart: any) {     
  //       var data = chart.data.datasets[0].data;
  //       var sum = data.reduce(function (a: any, b: any) {
  //         var x = a + b;
  //         var y = parseFloat(x.toFixed(2));
  //         return y;
  //         }, 0);
  //       var width = chart.chart.width,
  //         height = chart.chart.height,
  //         ctx = chart.chart.ctx;
  //       ctx.restore();
  //       var fontSize = (height / 14).toFixed(2);
  //       ctx.font = fontSize + "px Verdana";
  //       ctx.textBaseline = "middle";
  //       ctx.fillStyle = "blue";
         
  //      if (sum != 0) {
  //         var text = sum,
  //           textX = Math.round((width - ctx.measureText(text).width) / 2),
  //           textY = height / 2;
  //       }
  //       else {
  //         text = 'Data Not Available', textX = Math.round((width - ctx.measureText(text).width) / 2),
  //           textY = height / 2;
  //       }
  //       ctx.fillText(text, textX, textY);
  //       ctx.save();             
  //     }     
  //   });
  //   // this.loading.dismissAll();
  // }
  ngOnInit() {
    // register plugin
    // var ctx = document.getElementById("myChart");
    // var myChart = new Chart(ctx);
    Chart.plugins.register({    
      beforeDraw: function (chart:any) {       
        if (chart.config.options.plugin_one_attribute === 'chart1') {
          // alert('hi')
          // Plugin code here...    
               
          var data = chart.data.datasets[0].data;
          var sum = data.reduce(function (a:any, b:any) {
            var x = a + b;
            var y = parseFloat(x.toFixed(2));
            // y=this.numberPipe.transform(y, '1.2-2');
            return y;
          }, 0);
          var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;
          ctx.restore();
          var fontSize = (height / 18).toFixed(2);
          ctx.font = fontSize + "px Verdana";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "blue";
          ctx.fontStyle= "bold";
        
          if (sum != 0) {
            // var text = sum,
            var text = sum.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              // var text =this.numberPipe.transform(sum,'1.2-2'),
              // var text = this.numberPipe.transform(sum, '1.2-2'),          
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 1.9;
          }
          else {
            text = 'Data Not Available', textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2;
          }
          ctx.fillText(text, textX, textY);
          ctx.save();
        }

        if (chart.config.options.plugin_one_attribute === 'chart2') {
          // alert('hi1')
          var data = chart.data.datasets[0].data;
          var sum = data.reduce(function (a:any, b:any) {
            var x = a + b;
            var y = parseFloat(x.toFixed(2));
            // y=this.numberPipe.transform(y, '1.2-2');
            return y;
          }, 0);
          var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;
          ctx.restore();
          var fontSize = (height / 18).toFixed(2);
          ctx.font = fontSize + "px Verdana";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "blue";
          ctx.fontStyle= "bold";


          if (sum != 0) {
            // var text = sum,
            var text = sum.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              // var text =this.numberPipe.transform(sum,'1.2-2'),
              // var text = this.numberPipe.transform(sum, '1.2-2'),          
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 1.9;
          }
          else {
            text = 'Data Not Available', textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2;
          }
          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }
    });

  }
  ionViewDidLoad() {
    
    console.log('ionViewDidLoad DashboardPage');
  }
  //  ClaimsInfoChart
  public doughnutChartLabels: Array<string> = ['Approved', 'Pending', 'Rejected','Paid'];
  public doughnutChartData: Array<number> = [];

  public doughnutChartType: string = 'doughnut';
  public doughnutChartColors: any[] = [{ backgroundColor: ["#008000", "orange", "red","rgb(90, 165, 90)"] }];

  public chartClicked(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }

  doughnutChartOptions = {
    // showInLegend : true,
    plugin_one_attribute: 'chart2',
    cutoutPercentage: 70,
    responsive: true,
    // centerText: true,
    legend: {
      display: true,
      position: 'bottom'
    },
    title: {
      display: true,
    //  text: 'My Claim Count',
      fontSize: 20,
      fontColor: 'green'
    },
    // pieceLabel: {
    //   mode: 'value',
    //   overlap: true,
    //   fontColor: ['white', 'blue', 'yellow','black'],
    //  // fontStyle: 'bold'
    // //  indexLabelPlacement: "outside", 
    // },

    tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItem: any, data: any) {
          var label = data.labels[tooltipItem.index];
          var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return label + ' : ' + datasetLabel.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ';
        }
      }
    },
  }

  // ClaimAmountChart
  public claimAmountLabels: Array<string> = ['Approved', 'Pending', 'Rejected','Paid'];
  public claimAmountData: Array<number> = [];
  public claimAmountChartType: string = 'doughnut';
  public claimAmountChartColors: any[] = [{ backgroundColor: ["#008000", "orange", "red","rgb(90, 165, 90)"] }];
  public claimAmountClicked(e: any): void {
    console.log(e);
  }
  public claimAmountHovered(e: any): void {
    console.log(e);
  }
  claimAmountOptions = {
    // showInLegend : true,
    plugin_one_attribute: 'chart1',
    cutoutPercentage: 70,
    responsive: true,
    // centerText: true,
    legend: {
      display: true,
      position: 'bottom'
    },
    title: {
      display: true,
     // text: 'My Claim Amount',
      fontSize: 20,
      fontColor: 'green'
    },
    // pieceLabel: {
    //   // mode: 'value',
    //   //fontColor:'blue',
    //   render: function (args:any) {
    //     const label = args.label,
    //       value = args.value;
    //     //console.log(label + ': ' + value)
    //     return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //   },
    //   overlap: true,
    //  //s fontStyle: 'bold',
    //   fontColor: ['white', 'blue', 'yellow','black'],
    //   // indexLabelPlacement: "outside", 
    // },

    tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItem: any, data: any) {
          var label = data.labels[tooltipItem.index];
          var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return label + ' : ' + datasetLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ';
        }
      }
    },
  }

  Month_Changed(value: any) {
    //alert(value)
    this.month_value = value;
    this.GetDashboardInfo();
    this.GetInfoForCards();
  }
  Year_Changed(value: any) {
    //alert(value)
    this.year_value = value;
    this.GetDashboardInfo();
    this.GetInfoForCards();
  }
  GetDashboardInfo() {

    if (this.month_value != undefined) {
      this.baseResourceUrl = constants.DREAMFACTORY_TABLE_URL + '/vw_dashboardchart?filter=(USER_GUID =' + localStorage.getItem("g_USER_GUID") + ')and(MONTH_NUM=' + this.Month_Change_ngModel + ')and(YEAR=' + this.year_value + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      // console.log('hi ' + this.baseResourceUrl)
    }
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimrequestdetails = data["resource"][0];
        // console.table(this.claimrequestdetails)
        if (data["resource"][0] != null) {

          var approve = parseInt(this.claimrequestdetails.ApprovedReqCount);
          var pending = parseInt(this.claimrequestdetails.PendingReqCount);
          var rejected = parseInt(this.claimrequestdetails.RejectedReqCount);
          var paid = parseInt(this.claimrequestdetails.PaidReqCount);

          this.doughnutChartData = [approve, pending, rejected, paid];

          if (this.claimrequestdetails.ApprovedClaimAmount !== null && this.claimrequestdetails.ApprovedClaimAmount !== undefined) {
            var approveAmount = parseFloat(this.claimrequestdetails.ApprovedClaimAmount).toFixed(2);
            // approveAmount = this.numberPipe.transform(approveAmount, '1.2-2');
          }
          else { approveAmount = '0.00' }

          if (this.claimrequestdetails.PendingClaimAmount !== null && this.claimrequestdetails.PendingClaimAmount !== undefined) {
            var pendingAmount = parseFloat(this.claimrequestdetails.PendingClaimAmount).toFixed(2);
            // pendingAmount=this.format(pendingAmount);
            // this.numberPipe.transform(amount, '1.2-2');
            // pendingAmount = this.numberPipe.transform(pendingAmount, '1.2-2');
          //  alert(pendingAmount)
          }
          else { pendingAmount = '0.00' }

          if (this.claimrequestdetails.RejectedClaimAmount !== null && this.claimrequestdetails.RejectedClaimAmount !== undefined) {
            var rejectedAmount = parseFloat(this.claimrequestdetails.RejectedClaimAmount).toFixed(2);
            // rejectedAmount = this.numberPipe.transform(rejectedAmount, '1.2-2');
          }
          else { rejectedAmount = '0.00' }

          if (this.claimrequestdetails.PaidClaimAmount !== null && this.claimrequestdetails.PaidClaimAmount !== undefined) {
            var PaidClaimAmount = parseFloat(this.claimrequestdetails.PaidClaimAmount).toFixed(2);
            // rejectedAmount = this.numberPipe.transform(rejectedAmount, '1.2-2');
          }
          else { PaidClaimAmount = '0.00' }

          //var approveAmount=(this.claimrequestdetails.ApprovedClaimAmount);parseFloat
          // var pendingAmount = parseFloat(this.claimrequestdetails.PendingClaimAmount).toFixed(2);
          // var rejectedAmount = parseFloat(this.claimrequestdetails.RejectedClaimAmount).toFixed(2);

          this.claimAmountData = [parseFloat(approveAmount), parseFloat(pendingAmount), parseFloat(rejectedAmount), parseFloat(PaidClaimAmount)];

          // console.log(this.claimAmountData)
          
          // For Display Data In Ion-cards
          this.Rejected_Claim_Count = this.claimrequestdetails.RejectedReqCount;
          this.Pending_Claim_Count = this.claimrequestdetails.PendingReqCount;
          this.Approved_Claim_Count = this.claimrequestdetails.ApprovedReqCount;

          this.PaidReqCount = this.claimrequestdetails.PaidReqCount;

          if (this.claimrequestdetails.RejectedClaimAmount != null) {
          this.Rejected_Claim_Amount = this.claimrequestdetails.RejectedClaimAmount.toFixed(2).toString();
            this.Rejected_Claim_Amount = this.numberPipe.transform(this.Rejected_Claim_Amount, '1.2-2');
          }
          else this.Rejected_Claim_Amount = '0.00';

          if (this.claimrequestdetails.PendingClaimAmount != null) {
          this.Pending_Claim_Amount = this.claimrequestdetails.PendingClaimAmount.toFixed(2).toString();
            this.Pending_Claim_Amount = this.numberPipe.transform(this.Pending_Claim_Amount, '1.2-2');
          }
          else this.Pending_Claim_Amount = '0.00';

          if (this.claimrequestdetails.ApprovedClaimAmount != null) {
          this.Approved_Claim_Amount = this.claimrequestdetails.ApprovedClaimAmount.toFixed(2).toString();
            this.Approved_Claim_Amount = this.numberPipe.transform(this.Approved_Claim_Amount, '1.2-2');
          }
          else this.Approved_Claim_Amount = '0.00';

          if (this.claimrequestdetails.PaidClaimAmount != null) {
            this.PaidClaimAmount = this.claimrequestdetails.PaidClaimAmount.toFixed(2).toString();
              this.PaidClaimAmount = this.numberPipe.transform(this.PaidClaimAmount, '1.2-2');
            }
            else this.PaidClaimAmount = '0.00';
          //
        }
        // if (data["resource"][0] != null) {
        //   var approve = parseInt(this.claimrequestdetails.ApprovedReqCount);
        //   var pending = parseInt(this.claimrequestdetails.PendingReqCount);
        //   var rejected = parseInt(this.claimrequestdetails.RejectedReqCount);
        //   this.doughnutChartData = [approve, pending, rejected];

        //   if (this.claimrequestdetails.ApprovedClaimAmount !== null && this.claimrequestdetails.ApprovedClaimAmount !== undefined) {
        //     var approveAmount = parseFloat(this.claimrequestdetails.ApprovedClaimAmount).toFixed(2);
        //   }
        //   else { approveAmount = '0' }
        //   if (this.claimrequestdetails.PendingClaimAmount !== null && this.claimrequestdetails.PendingClaimAmount !== undefined) {
        //     var pendingAmount = parseFloat(this.claimrequestdetails.PendingClaimAmount).toFixed(2);
        //   }
        //   else { pendingAmount = '0' }
        //   if (this.claimrequestdetails.RejectedClaimAmount !== null && this.claimrequestdetails.RejectedClaimAmount !== undefined) {
        //     var rejectedAmount = parseFloat(this.claimrequestdetails.RejectedClaimAmount).toFixed(2);
        //   }
        //   else { rejectedAmount = '0' }

        //   this.claimAmountData = [parseFloat(approveAmount), parseFloat(pendingAmount), parseFloat(rejectedAmount)];

        //   // For Display Data In Ion-cards
        //   this.Rejected_Claim_Count = this.claimrequestdetails.RejectedReqCount;
        //   this.Pending_Claim_Count = this.claimrequestdetails.PendingReqCount;
        //   this.Approved_Claim_Count = this.claimrequestdetails.ApprovedReqCount;

        //   if (this.claimrequestdetails.RejectedClaimAmount != null)
        //   this.Rejected_Claim_Amount = this.claimrequestdetails.RejectedClaimAmount.toFixed(2).toString();        
        //   else this.Rejected_Claim_Amount = '0.00';
          
        //   if (this.claimrequestdetails.PendingClaimAmount != null)
        //     this.Pending_Claim_Amount = this.claimrequestdetails.PendingClaimAmount.toFixed(2).toString();
        //   else this.Pending_Claim_Amount = '0.00';

        //   if (this.claimrequestdetails.ApprovedClaimAmount != null)
        //     this.Approved_Claim_Amount = this.claimrequestdetails.ApprovedClaimAmount.toFixed(2).toString();
        //   else this.Approved_Claim_Amount = '0.00';
        //   //

        // }
        else {
          approve = 0;
          pending = 0;
          rejected = 0;
          paid = 0;
          this.doughnutChartData = [approve, pending, rejected,paid];
          pendingAmount = '0.00';
          rejectedAmount = '0.00';
          approveAmount = '0.00';
          PaidClaimAmount='0.00';

          this.claimAmountData = [parseFloat(approveAmount), parseFloat(pendingAmount), parseFloat(rejectedAmount), parseFloat(PaidClaimAmount)];

          this.doughnutChartLabels = data.label;
          this.claimAmountLabels = data.label;


          // For Display Data In Ion-cards
          this.Rejected_Claim_Count = 0;
          this.Pending_Claim_Count = 0;
          this.Approved_Claim_Count = 0;
          this.PaidReqCount=0;

          this.Rejected_Claim_Amount = '0.00';
          this.Pending_Claim_Amount = '0.00';
          this.Approved_Claim_Amount = '0.00';
          this.PaidClaimAmount= '0.00';
          //
        }
      });

  }

  GetInfoForCards() {
    this.baseResourceUrl_Card = constants.DREAMFACTORY_TABLE_URL + '/vw_dashboard_card?filter=(USER_GUID =' + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(this.baseResourceUrl_Card)
      .map(res => res.json())
      .subscribe(data => {
        this.Year_Card = data["resource"];
        // console.log('user '+this.baseResourceUrl_Card);
        // console.table(this.Year_Card);

        if (this.Year_Card.length != 0) {
          this.RejectedClaimCount_year = this.Year_Card[0]["RejectedClaimCount_year"];
          if (this.RejectedClaimCount_year != null && this.RejectedClaimCount_year != undefined)
            this.RejectedClaimCount_year;
          else
            this.RejectedClaimCount_year = '0';
  
          this.PendingClaimCount_year = this.Year_Card[0]["PendingClaimCount_year"];
          if (this.PendingClaimCount_year != null && this.PendingClaimCount_year != undefined)
            this.PendingClaimCount_year;
          else
            this.PendingClaimCount_year = '0';
  
            this.ApprovedClaimCount_year = this.Year_Card[0]["ApprovedClaimCount_year"];
            if (this.ApprovedClaimCount_year != null && this.ApprovedClaimCount_year != undefined)
              this.ApprovedClaimCount_year;
            else
              this.ApprovedClaimCount_year = '0';

              this.PaidClaimCount_year = this.Year_Card[0]["PaidClaimCount_year"];
              if (this.PaidClaimCount_year != null && this.PaidClaimCount_year != undefined)
                this.PaidClaimCount_year;
              else
                this.PaidClaimCount_year = '0';
  
            this.RejectedClaimAmount_year = this.Year_Card[0]["RejectedClaimAmount_year"];
          if (this.RejectedClaimAmount_year != null && this.RejectedClaimAmount_year != undefined)
            this.RejectedClaimAmount_year = this.numberPipe.transform(this.RejectedClaimAmount_year, '1.2-2');
          else
            this.RejectedClaimAmount_year = '0.00';
  
          this.PendingClaimAmount_year = this.Year_Card[0]["PendingClaimAmount_year"];
          if (this.PendingClaimAmount_year != null && this.PendingClaimAmount_year != undefined)
            this.PendingClaimAmount_year = this.numberPipe.transform(this.PendingClaimAmount_year, '1.2-2');
          else
            this.PendingClaimAmount_year = '0.00';
  
            this.ApprovedClaimAmount_year = this.Year_Card[0]["ApprovedClaimAmount_year"];
            if (this.ApprovedClaimAmount_year != null && this.ApprovedClaimAmount_year != undefined)
              this.ApprovedClaimAmount_year = this.numberPipe.transform(this.ApprovedClaimAmount_year, '1.2-2');
            else
              this.ApprovedClaimAmount_year = '0.00';

              this.PaidClaimAmount_year = this.Year_Card[0]["PaidClaimAmount_year"];
            if (this.PaidClaimAmount_year != null && this.PaidClaimAmount_year != undefined)
              this.PaidClaimAmount_year = this.numberPipe.transform(this.PaidClaimAmount_year, '1.2-2');
            else
              this.PaidClaimAmount_year = '0.00';
            }
            else
            {
              this.RejectedClaimCount_year = '0';
              this.PendingClaimCount_year = '0';
              this.ApprovedClaimCount_year = '0';
              this.PaidClaimCount_year= '0';

              this.RejectedClaimAmount_year = '0.00';
              this.PendingClaimAmount_year = '0.00';
              this.ApprovedClaimAmount_year = '0.00';
              this.PaidClaimAmount_year='0.00';
            }


      });
  }
  GetData_Years() {
       this.http
      .get(this.baseResourceUrl_New)
      .map(res => res.json())
      .subscribe(data => {
        this.years_data = data["resource"];
        // console.log(this.years_data.length)
       
        if (this.years_data.length == 0) {
          this.years = [this.year_value - 1, this.year_value];
             return;
        }
        else { }
        this.years = this.years_data;
        var uniqueYears = this.deduplicate(this.years);
        //console.log(uniqueYears)
        this.years = uniqueYears;
        var SortuniqueYears = this.sortUnique(this.years);
        //console.log(SortuniqueYears)
        this.years = SortuniqueYears;
      });
      
  }
  Rejected_Click(Rejected: any) {
    this.navCtrl.setRoot('UserclaimslistPage', { Rejected: "Rejected" });
  }
  Pending_Click(Pending: any) {
    this.navCtrl.setRoot('UserclaimslistPage', { Pending: "Pending" });
  }
  Approved_Click(Approved: any) {
    this.navCtrl.setRoot('UserclaimslistPage', { Approved: "Approved" });
  }
  Paid_Click()
  {
    this.navCtrl.setRoot('UserclaimslistPage', { Approved: "Paid" });
  }

}
