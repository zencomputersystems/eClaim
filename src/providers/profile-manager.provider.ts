import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { ApiManagerProvider } from '../providers/api-manager.provider';
import { ClaimWorkFlowHistoryModel } from './../models/claim-work-flow-history.model';
import { MainClaimRequestModel } from './../models/main-claim-request.model';
import { MainClaimReferanceModel } from './../models/main-claim-ref.model';
import { UUID } from 'angular2-uuid';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { NavController, App } from 'ionic-angular';
import { ClaimapprovertasklistPage } from '../pages/claimapprovertasklist/claimapprovertasklist';


@Injectable()

export class ProfileManagerProvider {
    managerInfo :any[];
    levels: any[];
    userGUID: any; TenantGUID: any; previousLevel: number; previousAssignedTo: string; level: any;
    mainClaimReq: MainClaimRequestModel; claimRequestGUID: any; isRemarksAccepted: any;
  
    navCtrl:any;
    constructor(public http: Http, public api: ApiManagerProvider, app : App) {
      this.navCtrl = app.getActiveNav()
      this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
      this.userGUID = localStorage.getItem('g_USER_GUID');
    }
  
    profileLevel: any; assignedTo: any; stage: any;
  
    UpdateProfileInfo(mainClaimReq: MainClaimRequestModel) {
<<<<<<< HEAD
      debugger;
      this.api.updateClaimRequest(mainClaimReq).subscribe(res => console.log(res.json()))
=======
      this.api.updateClaimRequest(mainClaimReq).subscribe(res => 
        {
          if(mainClaimReq.STATUS==='Rejected')
          alert('Claim has been '+mainClaimReq.STATUS +'.')
          else
          alert('Claim has been Approved.')
         // alert('Claim has been '+mainClaimReq.STATUS+'.');
          this.navCtrl.setRoot(ClaimapprovertasklistPage);
      }
      
        // console.log(res.json())
      )
>>>>>>> master
    }    
  
    getMainClaimReqInfo(claimRef: ClaimWorkFlowHistoryModel, level: any, claimRequestGUID: any, isRemarksAccepted: any) {
      debugger;
      this.level = level;
      this.claimRequestGUID = claimRequestGUID;
      this.isRemarksAccepted = isRemarksAccepted;
      //this.userGUID = localStorage.getItem('g_USER_GUID');
  
      this.api.getClaimRequestByClaimReqGUID(this.claimRequestGUID).subscribe(data => {
        debugger;
        claimRef.ASSIGNED_TO = this.previousAssignedTo = data[0].ASSIGNED_TO;
        claimRef.PROFILE_LEVEL = this.previousLevel = data[0].PROFILE_LEVEL;
        // data[0].STAGE = this.stage;
        // data[0].ASSIGNED_TO = this.assignedTo;
        // data[0].PROFILE_LEVEL = this.level;
        // if (this.level === '-1')
        //   data[0].STATUS = 'Approved';
        // else if (this.level === '0' || this.isRemarksAccepted === false)
        //   data[0].STATUS = 'Rejected';
  
        this.mainClaimReq = data[0];
  
<<<<<<< HEAD
        this.SaveWorkFlow(claimRef,data[0].PROFILE_JSON,level);
       // this.processProfileJSON(data[0].PROFILE_JSON)
=======
        this.SaveWorkFlow(claimRef, data[0].PROFILE_JSON,level);
        //this.processProfileJSON(data[0].PROFILE_JSON)
>>>>>>> master
      })
    }
  
    GetDirectManagerByManagerGUID() {
      return new Promise((resolve, reject) => {
      this.api.getApiModel('user_info', 'filter=USER_GUID=' + this.assignedTo).subscribe(res => {
        this.managerInfo = res["resource"]
        this.managerInfo.forEach(userElm => {
          this.stage = userElm.DEPT_GUID;
        })
      }) 
      resolve(true);
    }) 
    }
  
    GetDirectManager() {
      return new Promise((resolve, reject) => {
      this.api.getApiModel('view_manager_details', 'filter=USER_GUID=' + this.userGUID).subscribe(res => {
        this.managerInfo = res["resource"]
        this.managerInfo.forEach(userElm => {
          // this.assignedTo = userElm.MANAGER_GUID;
          // this.stage = userElm.DEPT_GUID;
          this.assignedTo = userElm.MANAGER_GUID;
          this.stage = userElm.MANAGER_DEPT_GUID;  
        })  
      })
      resolve(true);
    })  
    }
  
<<<<<<< HEAD
  //   SaveWorkFlow(claimRef: ClaimWorkFlowHistoryModel) {
  // debugger;
  //     this.api.postData('claim_work_flow_history', claimRef.toJson(true)).subscribe((response) => {
  //       var postClaimMain = response.json();
  //       this.api.sendEmail();
  
  //       this.mainClaimReq.STAGE = this.stage;
  //       this.mainClaimReq.ASSIGNED_TO = this.assignedTo;
  //       this.mainClaimReq.PROFILE_LEVEL = this.level;
  //       this.mainClaimReq.UPDATE_TS =  new Date().toISOString();
  //       if (this.level === '-1')
  //       this.mainClaimReq.STATUS = 'Approved';
  //       else if (this.level === '0' || this.isRemarksAccepted === false)
  //       this.mainClaimReq.STATUS = 'Rejected';
  //       this.UpdateProfileInfo(this.mainClaimReq);
  //       alert('Claim action submitted successfully.')
  
  //     })
  //   }
  SaveWorkFlow(claimRef: ClaimWorkFlowHistoryModel,profile_Json:any,level:any) {
    debugger;
    var postClaimMain;
        this.api.postData('claim_work_flow_history', claimRef.toJson(true)).subscribe((response) => {
          postClaimMain = response.json();
        });

  debugger;
     this.processProfileJSON(profile_Json,level)
          this.api.sendEmail();
          this.mainClaimReq.STAGE = this.stage;
          this.mainClaimReq.ASSIGNED_TO = this.assignedTo;
          this.mainClaimReq.PROFILE_LEVEL = this.level;
          this.mainClaimReq.UPDATE_TS =  new Date().toISOString();
          if (this.level === '-1')
          this.mainClaimReq.STATUS = 'Approved';
          else if (this.level === '0' || this.isRemarksAccepted === false)
          this.mainClaimReq.STATUS = 'Rejected';
          this.UpdateProfileInfo(this.mainClaimReq);
          alert('Claim action submitted successfully.')

      }
=======
    SaveWorkFlow(claimRef: ClaimWorkFlowHistoryModel, profile_Json: any,level:any) {
  
      this.api.postData('claim_work_flow_history', claimRef.toJson(true)).subscribe((response) => {
        var postClaimMain = response.json();
        //this.api.sendEmail();
      })
      this.processProfileJSON(profile_Json,level)
        this.mainClaimReq.STAGE = this.stage;
        this.mainClaimReq.ASSIGNED_TO = this.assignedTo;
        this.mainClaimReq.PROFILE_LEVEL = this.level;
        this.mainClaimReq.UPDATE_TS =  new Date().toISOString();
        if (this.level === '-1')
        this.mainClaimReq.STATUS = 'Approved';
        else if (this.level === '0' || this.isRemarksAccepted === false){
          this.mainClaimReq.STATUS = 'Rejected';
          this.mainClaimReq.PROFILE_LEVEL = 0;
          this.mainClaimReq.STAGE = null;
          this.mainClaimReq.ASSIGNED_TO = null;
        }
        this.UpdateProfileInfo(this.mainClaimReq);
        //alert('Claim action submitted successfully.')

        // This is for Approval Send email to User and next approver
        this.api.EmailNextApprover(this.mainClaimReq.CLAIM_REQUEST_GUID, this.mainClaimReq.CLAIM_REF_GUID, this.mainClaimReq.ASSIGNED_TO, this.mainClaimReq.CLAIM_TYPE_GUID, this.mainClaimReq.START_TS, this.mainClaimReq.END_TS, this.mainClaimReq.CREATION_TS, this.profileLevel);
  
     
    }
>>>>>>> master
  
    ProcessProfileMng(remarks: any, approverGUID: any, level: any, claimRequestGUID: any, isRemarksAccepted: any) { 
      debugger;
      this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
      this.userGUID = localStorage.getItem('g_USER_GUID');

      let claimHistoryRef: ClaimWorkFlowHistoryModel = new ClaimWorkFlowHistoryModel();
      claimHistoryRef.CLAIM_WFH_GUID = UUID.UUID();
      claimHistoryRef.CLAIM_REQUEST_GUID = claimRequestGUID;
      claimHistoryRef.REMARKS = remarks;
      claimHistoryRef.STATUS = isRemarksAccepted ? 'Accepted' : 'Rejected';
      claimHistoryRef.USER_GUID = approverGUID;
      claimHistoryRef.CREATION_TS = new Date().toISOString();
      claimHistoryRef.UPDATE_TS = new Date().toISOString();
     
      this.getMainClaimReqInfo(claimHistoryRef, level, claimRequestGUID, isRemarksAccepted);
      // this.readProfile(level, claimRequestGUID, isRemarksAccepted) ;
      // claimHistoryRef.ASSIGNED_TO = this.previousAssignedTo;
      // claimHistoryRef.PROFILE_LEVEL = this.previousLevel;
      // this.api.postData('claim_work_flow_history', claimHistoryRef.toJson(true)).subscribe((response) => {
      //   var postClaimMain = response.json();
      //   this.api.sendEmail();
  
      //   this.UpdateProfileInfo(this.mainClaimReq);
      //   alert('Claim action submitted successfully.')
  
      // })
    }   

    processProfileJSON(stringProfileJSON: any,level:any) {
<<<<<<< HEAD
      debugger;
=======
>>>>>>> master
      let profileJSON = JSON.parse(stringProfileJSON);
      this.levels = profileJSON.profile.levels.level
      let nextLevel;
      this.levels.forEach(element => {
        if (element['-id'] == level) {
          var temp: any[] =  element['conditions']['condition'];
                 temp.forEach(condElement => {          
            if (condElement['nextlevel']['-final'] === 'true')
              nextLevel = '-1';
            else if (condElement['-status'] === 'approved') {
              nextLevel = condElement['nextlevel']['#text'];
            }
            else if (condElement['-status'] === 'rejected') {
              nextLevel = '0';
            }
          });
        }
      });
  
      this.level = nextLevel;
  
      if (this.level === '-1' || this.level === '0') {
        this.assignedTo = '';
        this.stage = '';
      }
      else {
        this.getInfoLevels(this.levels, this.level)
        // levels.forEach(element => {
        //   if (element['-id'] == this.level) {
        //     this.profileLevel = this.level;
        //     if (element['approver']['-directManager'] === '1') {
        //       this.GetDirectManager();
        //     }
  
        //     if (element['approver']['-keytype'] === 'userGUID') {
        //       this.assignedTo = element['approver']['#text'];
        //       this.GetDirectManagerByManagerGUID();
        //     }
        //   }
        // });
      }
    }    

    getInfoLevels(levels: any[], level: any) {
      levels.forEach(element => {
        if (element['-id'] == level) {
          this.profileLevel = level;
          if (element['approver']['-directManager'] === '1') {
            let temp = this.GetDirectManager(); temp.then();
          }
          if (element['approver']['-keytype'] === 'userGUID') {
            this.assignedTo = element['approver']['#text'];
            let temp = this.GetDirectManagerByManagerGUID(); temp.then();
          }
        }
      });
    }

    getProfileForUser() {
      this.api.getClaimRequestByClaimReqGUID('63a9730e-5421-28c1-0c60-e36c1384fac6').subscribe(data => {
        let stringProfileJSON = data[0].PROFILE_JSON
        let profileJSON = JSON.parse(stringProfileJSON);
        let levels = profileJSON.profile.levels.level;
        this.getInfoLevels(levels, '1');
  
      })
    }

    SaveClaim(claimRefGUID: any) {
      //, amount, isCustomer, value
      let claimReqMainRef: MainClaimRequestModel = new MainClaimRequestModel();
      // if (this.claimRequestGUID != undefined)
      //   claimReqMainRef.CLAIM_REQUEST_GUID = this.claimRequestGUID
      // else
      claimReqMainRef.CLAIM_REQUEST_GUID =this.formValues.uuid===undefined? UUID.UUID():this.formValues.uuid;
      // claimReqMainRef.CLAIM_REQUEST_GUID = UUID.UUID();
      claimReqMainRef.TENANT_GUID = this.TenantGUID;
      claimReqMainRef.CLAIM_REF_GUID = claimRefGUID;
      claimReqMainRef.MILEAGE_GUID = this.formValues.vehicleType;
      claimReqMainRef.ALLOWANCE_GUID = this.formValues.meal_allowance;
      claimReqMainRef.CLAIM_TYPE_GUID = this.formValues.claimTypeGUID;
      claimReqMainRef.TRAVEL_DATE = this.formValues.travel_date;
      claimReqMainRef.START_TS = this.formValues.start_DT;
      claimReqMainRef.END_TS = this.formValues.end_DT;
      claimReqMainRef.MILEAGE_AMOUNT = this.claimAmount;
      claimReqMainRef.CLAIM_AMOUNT = this.claimAmount;
      claimReqMainRef.CREATION_TS = new Date().toISOString();
      claimReqMainRef.UPDATE_TS = new Date().toISOString();
      claimReqMainRef.FROM = this.formValues.origin;
      claimReqMainRef.DESTINATION = this.formValues.destination;
      claimReqMainRef.DISTANCE_KM = this.formValues.distance;
      claimReqMainRef.DESCRIPTION = this.formValues.description;
      claimReqMainRef.ASSIGNED_TO = this.assignedTo;
      claimReqMainRef.PROFILE_LEVEL = this.profileLevel;
      claimReqMainRef.PROFILE_JSON = this.profileJSON;
      claimReqMainRef.STATUS = this.formValues.uuid === undefined ? 'Pending' : 'Drafting';
      claimReqMainRef.STAGE = this.stage;
      claimReqMainRef.ATTACHMENT_ID = this.formValues.attachment_GUID;
      claimReqMainRef.TRAVEL_TYPE = this.formValues.travelType === 'Outstation' ? '1' : '0';

      if (this.isCustomer) {
        claimReqMainRef.CUSTOMER_GUID = this.formValues.soc_no;
      }
      else {
        claimReqMainRef.SOC_GUID = this.formValues.soc_no;
      }
      this.api.postData('main_claim_request', claimReqMainRef.toJson(true)).subscribe((response) => {
        var postClaimMain = response.json();
        this.api.sendEmail(this.formValues.claimTypeGUID, this.formValues.start_DT, this.formValues.end_DT, new Date().toISOString());
        localStorage.setItem("g_CR_GUID", postClaimMain["resource"][0].CLAIM_REQUEST_GUID);
        // this.ClaimRequestMain = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;
        //this.MainClaimSaved = true;
        if (this.formValues.uuid === undefined) {
          //this.api.presentToast('Claim has submitted successfully.')
           alert('Claim has registered successfully.')
          this.navCtrl.setRoot(DashboardPage);
        }
        else
          alert('Please click (+) icon to include additional details and submit your claim.')       
      })
    }

    saveClaimRef(month: any, year: any) {
      let claimReqRef: MainClaimReferanceModel = new MainClaimReferanceModel();
      claimReqRef.CLAIM_REF_GUID = UUID.UUID();
      claimReqRef.USER_GUID = this.userGUID;
      claimReqRef.TENANT_GUID = this.TenantGUID;
      claimReqRef.REF_NO = this.userGUID + '/' + month + '/' + year;
      claimReqRef.MONTH = month;
      claimReqRef.YEAR = year;
      claimReqRef.STATUS = 'Pending';
      claimReqRef.CREATION_TS = new Date().toISOString();
      claimReqRef.UPDATE_TS = new Date().toISOString();
      this.api.postData('main_claim_ref', claimReqRef.toJson(true)).subscribe((response) => {
        var postClaimRef = response.json();
        let claimRefGUID = postClaimRef["resource"][0].CLAIM_REF_GUID;
        this.SaveClaim(claimRefGUID);
      })
    }

    formValues: any; claimAmount: any; isCustomer: any; profileJSON: any;
    save(formValues: any, amount: any, isCustomer: any) {
      this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
      this.userGUID = localStorage.getItem('g_USER_GUID');

      this.formValues = formValues;
      this.claimAmount = amount;
      this.isCustomer = isCustomer;
      let month = new Date(formValues.travel_date).getMonth() + 1;
      let year = new Date(formValues.travel_date).getFullYear();
  
      // this.api.getClaimRequestByClaimReqGUID('3d1a5bd4-7263-1203-dfd1-efbbf1621372').subscribe(data => {
        this.http.get('assets/profile.json').map((response) => response.json()).subscribe(data => { 
        let stringProfileJSON = this.profileJSON =  JSON.stringify(data); 
        // let stringProfileJSON = this.profileJSON= data[0].PROFILE_JSON
        let profileJSON = JSON.parse(stringProfileJSON);
        let levels = profileJSON.profile.levels.level;
        this.getInfoLevels(levels, '1');
  
  
        this.api.getApiModel('main_claim_ref', 'filter=(USER_GUID=' + this.userGUID + ')AND(MONTH=' + month + ')AND(YEAR=' + year + ')')
          .subscribe(claimRefdata => {
            if (claimRefdata["resource"][0] == null) {
              this.saveClaimRef(month, year);
            }
            else {
              let claimRefGUID = claimRefdata["resource"][0].CLAIM_REF_GUID;
              this.SaveClaim(claimRefGUID);
            }
          })
  
      })
    }  
  }
