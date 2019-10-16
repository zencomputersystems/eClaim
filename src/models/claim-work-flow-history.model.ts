export class ClaimWorkFlowHistoryModel {
  constructor(
    public CLAIM_REQUEST_GUID: string = null,
    public CLAIM_WFH_GUID: string = null,
    public REMARKS: string = null,
    public STATUS: string = null,
    public USER_GUID: string = null, 
    public CREATION_TS: string = null,
    public UPDATE_TS: string = null, 
    public CREATION_USER_GUID: string = null,
    public UPDATE_USER_GUID: string = null,
    public ASSIGNED_TO: string = null,
    public PROFILE_LEVEL: number = null
 
  ) { }


  static fromJson(json: any) {
    if (!json) return;
    return new ClaimWorkFlowHistoryModel(
      json.CLAIM_REQUEST_GUID,
      json.CLAIM_WFH_GUID,
      json.REMARKS,
      json.STATUS,
      json.USER_GUID,
      json.CREATION_TS,
      json.UPDATE_TS,
      json.CREATION_USER_GUID,
      json.UPDATE_USER_GUID,
      json.ASSIGNED_TO,
      json.PROFILE_LEVEL
    );
  }

  toJson(stringify?: boolean): any {
    var doc = {
      CLAIM_REQUEST_GUID: this.CLAIM_REQUEST_GUID,
      CLAIM_WFH_GUID: this.CLAIM_WFH_GUID,
      REMARKS: this.REMARKS,
      STATUS: this.STATUS,
      USER_GUID: this.USER_GUID,
      CREATION_TS: this.CREATION_TS,
      UPDATE_TS: this.UPDATE_TS,
      CREATION_USER_GUID: this.CREATION_USER_GUID,
      UPDATE_USER_GUID: this.UPDATE_USER_GUID,
      ASSIGNED_TO: this.ASSIGNED_TO,
      PROFILE_LEVEL: this.PROFILE_LEVEL
    };
    return stringify ? JSON.stringify({ resource: [doc] }) : doc;
  }
}
