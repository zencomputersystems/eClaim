export class MainClaimReferanceModel {

    constructor(  
      public CLAIM_REF_GUID: string = null,
      public USER_GUID: string = null,
      public TENANT_GUID: string = null,
      public REF_NO: string = null,
      public MONTH: number = null,
      public YEAR: number = null,
      public STATUS: string = null,
      public STATUS_REMARKS: string = null,
      public CLOSURE_TYPE_GUID: string = null,
      public CREATION_TS: string = null,
      public CREATION_USER_GUID: string = null,
      public UPDATE_TS: string = null,
      public UPDATE_USER_GUID: string = null,
    ) { }
  
  
    static fromJson(json: any) {
      if (!json) return;
      return new MainClaimReferanceModel(
        json.CLAIM_REF_GUID,
        json.USER_GUID,
        json.TENANT_GUID,
        json.REF_NO,
        json.MONTH,
        json.YEAR,
        json.STATUS,
        json.STATUS_REMARKS,
        json.CLOSURE_TYPE_GUID,
        json.CREATION_TS,
        json.CREATION_USER_GUID,
        json.UPDATE_TS,
        json.UPDATE_USER_GUID
      );
    }
  
    toJson(stringify?: boolean): any {
      var doc = {
        CLAIM_REF_GUID: this.CLAIM_REF_GUID,
        USER_GUID: this.USER_GUID,
        TENANT_GUID: this.TENANT_GUID,
        REF_NO: this.REF_NO,
        MONTH: this.MONTH,
        YEAR: this.YEAR,
        STATUS: this.STATUS,
        STATUS_REMARKS: this.STATUS_REMARKS,
        CLOSURE_TYPE_GUID: this.CLOSURE_TYPE_GUID,
        CREATION_TS: this.CREATION_TS,
        CREATION_USER_GUID: this.CREATION_USER_GUID,
        UPDATE_TS: this.UPDATE_TS,
        UPDATE_USER_GUID: this.UPDATE_USER_GUID
      };
      return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
  }
  
