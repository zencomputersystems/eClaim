import { Base_Model } from './base_model';
export class QualificationSetup_Model extends Base_Model {
	constructor() {
		super();
	}

	public QUALIFICATION_TYPE_GUID: string = null;
	public TYPE_NAME: string = null;
	public TYPE_DESC: string = null;
	public TENANT_GUID: string = null;

	static fromJson(json: QualificationSetup_Model) {
		if (!json) return;
		return (
			json.QUALIFICATION_TYPE_GUID,
		    json.TYPE_NAME,
			json.TYPE_DESC,
			json.TENANT_GUID,
			json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
		);
    }
    
	toJson(stringify?: boolean): any {
		var doc = {
			QUALIFICATION_TYPE_GUID:this.QUALIFICATION_TYPE_GUID,
			TYPE_NAME:this.TYPE_NAME,
			TYPE_DESC:this.TYPE_DESC,
			TENANT_GUID:this.TENANT_GUID,
			CREATION_TS:this.CREATION_TS,
            CREATION_USER_GUID:this.CREATION_USER_GUID,
            UPDATE_TS:this.UPDATE_TS,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



