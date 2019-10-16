import { Base_Model } from './base_model';
export class PrintingClaim_Model extends Base_Model {
	constructor() {
        super();
    }

    public CLAIM_REQUEST_DETAIL_GUID: string = null;
    public CLAIM_REQUEST_GUID: string = null;
    public CLAIM_TYPE_GUID: string = null;
    public CLAIM_AMOUNT: string = null;
    public FROM: string = null;
    public DESTINATION: string = null;
    public DISTANCE_KM: string = null;
    public DESCRIPTION: string = null;
    public PAYMENT_TYPE_GUID: string = null;
    public START_TS: string = null;
    public END_TS: string = null;
    public ATTACHMENT_ID: string = null;
    public GST: string = null;


	static fromJson(json: PrintingClaim_Model) {
		if (!json) return;
		return (
			json.CLAIM_REQUEST_DETAIL_GUID,
		    json.CLAIM_REQUEST_GUID,
			json.CLAIM_TYPE_GUID,
            json.CLAIM_AMOUNT,
            json.FROM,
            json.DESTINATION,
            json.DISTANCE_KM,
            json.DESCRIPTION,
            json.PAYMENT_TYPE_GUID,
            json.START_TS,
            json.END_TS,
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
            CLAIM_REQUEST_DETAIL_GUID:this.CLAIM_REQUEST_DETAIL_GUID,
            CLAIM_REQUEST_GUID:this.CLAIM_REQUEST_GUID,
			CLAIM_TYPE_GUID:this.CLAIM_TYPE_GUID,
            CLAIM_AMOUNT:this.CLAIM_AMOUNT,
            FROM:this.FROM,
            DESTINATION:this.DESTINATION,
            DISTANCE_KM:this.DISTANCE_KM,
            DESCRIPTION:this.DESCRIPTION,
            PAYMENT_TYPE_GUID:this.PAYMENT_TYPE_GUID,
            START_TS:this.START_TS,
            END_TS:this.END_TS,
            ATTACHMENT_ID:this.ATTACHMENT_ID,
			CREATION_TS:this.CREATION_TS,
            CREATION_USER_GUID:this.CREATION_USER_GUID,
            UPDATE_TS:this.UPDATE_TS,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID,
            GST:this.GST
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}
