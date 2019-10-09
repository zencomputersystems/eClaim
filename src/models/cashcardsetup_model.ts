import { Base_Activation_Model } from './base_model';
export class CashcardSetup_Model extends Base_Activation_Model {
	constructor() {
        super();
    }
    public CASHCARD_GUID: string = null;
    public CASHCARD_SNO: string = null;
    public DESCRIPTION: string = null;
//    public ACTIVATION_FLAG: number = null;
    public ACCOUNT_ID: string = null;
    public ACCOUNT_PASSWORD: string = null;
    public MANAGEMENT_URL: string = null;
    public TENANT_GUID: string = null

	static fromJson(json: any) {
		if (!json) return;
		return (
			json.CASHCARD_GUID,
		    json.CASHCARD_SNO,
			json.DESCRIPTION,
			json.ACTIVATION_FLAG,
			json.ACCOUNT_ID,
            json.ACCOUNT_PASSWORD,
            json.MANAGEMENT_URL,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID,
            json.TENANT_GUID
		);
    }
    
	toJson(stringify?: boolean): any {
		var doc = {
			CASHCARD_GUID:this.CASHCARD_GUID,
			CASHCARD_SNO:this.CASHCARD_SNO,
			DESCRIPTION:this.DESCRIPTION,
			ACTIVATION_FLAG:this.ACTIVATION_FLAG,
			ACCOUNT_ID:this.ACCOUNT_ID,
            ACCOUNT_PASSWORD:this.ACCOUNT_PASSWORD,            
            MANAGEMENT_URL:this.MANAGEMENT_URL,
            CREATION_TS:this.CREATION_TS,
            CREATION_USER_GUID:this.CREATION_USER_GUID,
            UPDATE_TS:this.UPDATE_TS,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID,
            TENANT_GUID:this.TENANT_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



