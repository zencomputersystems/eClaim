import { Base_NameDescription_Model } from './base_model';
export class PaymentTypeSetup_Model extends Base_NameDescription_Model {
	constructor() {
		super();
	}

	public PAYMENT_TYPE_GUID: string = null;
	public TENANT_GUID: string = null;


	static fromJson(json: any) {
		if (!json) return;
		return (
			json.PAYMENT_TYPE_GUID,
		    json.TENANT_GUID,
			json.NAME,
			json.DESCRIPTION,
			json.CREATION_USER_GUID,
            json.CREATION_TS,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
		);
    }
    
	toJson(stringify?: boolean): any {
		var doc = {
			PAYMENT_TYPE_GUID:this.PAYMENT_TYPE_GUID,
			TENANT_GUID:this.TENANT_GUID,
			NAME:this.NAME,
			DESCRIPTION:this.DESCRIPTION,
			CREATION_USER_GUID:this.CREATION_USER_GUID,
            CREATION_TS:this.CREATION_TS,
            UPDATE_TS:this.UPDATE_TS,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



