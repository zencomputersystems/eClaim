import { Base_Model } from './base_model';
export class UserContact_Model extends Base_Model {
    constructor() {
        super();
    }
    
    public CONTACT_INFO_GUID: string = null;
    public USER_GUID: string = null;
    public TYPE: string = null;
    public CONTACT_NO: string = null;
    public DESCRIPTION: string = null;
    public REMARKS: string = null;

    static fromJson(json: UserContact_Model) {
		if (!json) return;
		return (
			json.CONTACT_INFO_GUID,
		    json.USER_GUID,
			json.TYPE,
            json.CONTACT_NO,
            json.DESCRIPTION,
            json.REMARKS,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
    	);
    }
    toJson(stringify?: boolean): any {
		var doc = {
			CONTACT_INFO_GUID:this.CONTACT_INFO_GUID,
			USER_GUID:this.USER_GUID,
			TYPE:this.TYPE,
            CONTACT_NO:this.CONTACT_NO,
            DESCRIPTION:this.DESCRIPTION,
            REMARKS:this.REMARKS,
            CREATION_TS:this.CREATION_TS,
            CREATION_USER_GUID:this.CREATION_USER_GUID,
            UPDATE_TS:this.UPDATE_TS,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}

