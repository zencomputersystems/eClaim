import { Base_Model } from './base_model';
export class StateSetup_Model extends Base_Model {
	constructor() {
		super();
	}

	public STATE_GUID: string = null;
	public NAME: string = null;
	public COUNTRY_GUID: string = null;

	static fromJson(json: StateSetup_Model) {
		if (!json) return;
		return (
			json.STATE_GUID,
            json.NAME,	
            json.COUNTRY_GUID,	   
			json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
		);
    }
    
	toJson(stringify?: boolean): any {
		var doc = {
			STATE_GUID:this.STATE_GUID,
            NAME:this.NAME,	
            COUNTRY_GUID:this.COUNTRY_GUID,				
			CREATION_TS:this.CREATION_TS,
            CREATION_USER_GUID:this.CREATION_USER_GUID,
            UPDATE_TS:this.UPDATE_TS,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



