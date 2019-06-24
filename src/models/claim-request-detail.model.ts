import { Base_Model } from './base_model';
export class ClaimRequestDetailModel extends Base_Model {
  constructor() {
    super();
  }

  public CLAIM_REQUEST_DETAIL_GUID: string = null;
  public CLAIM_REQUEST_GUID: string = null;
  public CLAIM_METHOD_GUID: string = null;
  public AMOUNT: string = null;
  public days: string = null;
  public DESCRIPTION: string = null;
  public PAYMENT_TYPE_GUID: string = null;
  public ATTACHMENT_ID: string = null;
  public GST: string = null;

  static fromJson(json: ClaimRequestDetailModel) {
    if (!json) return;
    return (
      json.CLAIM_REQUEST_DETAIL_GUID,
      json.CLAIM_REQUEST_GUID,
      json.CLAIM_METHOD_GUID,
      json.AMOUNT,
      json.days,
      json.DESCRIPTION,
      json.PAYMENT_TYPE_GUID,
      json.ATTACHMENT_ID,
      json.CREATION_TS,
      json.CREATION_USER_GUID,
      json.UPDATE_TS,
      json.UPDATE_USER_GUID,
      json.GST
    );
  }

  toJson(stringify?: boolean): any {
    var doc = {
      CLAIM_REQUEST_DETAIL_GUID: this.CLAIM_REQUEST_DETAIL_GUID,
      CLAIM_REQUEST_GUID: this.CLAIM_REQUEST_GUID,
      CLAIM_METHOD_GUID: this.CLAIM_METHOD_GUID,
      AMOUNT: this.AMOUNT,
      days: this.days,
      DESCRIPTION: this.DESCRIPTION,
      PAYMENT_TYPE_GUID: this.PAYMENT_TYPE_GUID,

      ATTACHMENT_ID: this.ATTACHMENT_ID,
      CREATION_TS: this.CREATION_TS,
      CREATION_USER_GUID: this.CREATION_USER_GUID,
      UPDATE_TS: this.UPDATE_TS,
      UPDATE_USER_GUID: this.UPDATE_USER_GUID,
      GST: this.GST
    };
    return stringify ? JSON.stringify({ resource: [doc] }) : doc;
  }
}
