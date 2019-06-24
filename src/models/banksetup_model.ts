import { Base_NameDescription_Model } from './base_model';
export class BankSetup_Model extends Base_NameDescription_Model {
	constructor(

	) {
		super();
	}
	public BANK_GUID: string = null;
	public TENANT_GUID: string = null;

	static fromJson(json: BankSetup_Model) {
		if (!json) return;
		return (
			json.BANK_GUID,
		    json.NAME,
			json.DESCRIPTION,
			json.TENANT_GUID,
			json.CREATION_TS,
			json.CREATION_USER_GUID,
			json.UPDATE_TS,
			json.UPDATE_USER_GUID
		);
    }
    
	toJson(stringify?: boolean): any {
		var doc = {
			BANK_GUID:this.BANK_GUID,
			
			NAME:this.NAME,
            DESCRIPTION:this.DESCRIPTION,
			TENANT_GUID:this.TENANT_GUID,
			CREATION_TS:this.CREATION_TS,
			CREATION_USER_GUID:this.CREATION_USER_GUID,
			UPDATE_TS:this.UPDATE_TS,
			UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



