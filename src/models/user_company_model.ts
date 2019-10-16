import { Base_Model } from './base_model';
export class UserCompany_Model extends Base_Model {
	constructor() {
    super();
  }

  public USER_COMPANY_GUID: string = null;
  public USER_GUID: string = null;
  public TENANT_COMPANY_SITE_GUID: string = null;
  public COMPANY_CONTACT_NO: string = null;

    static fromJson(json: UserCompany_Model) {
		if (!json) return;
		return (
			json.USER_COMPANY_GUID,
		    json.USER_GUID,
            json.TENANT_COMPANY_SITE_GUID,
            json.COMPANY_CONTACT_NO,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
    	);
    }
    toJson(stringify?: boolean): any {
		var doc = {
			USER_COMPANY_GUID:this.USER_COMPANY_GUID,
			USER_GUID:this.USER_GUID,
			TENANT_COMPANY_SITE_GUID:this.TENANT_COMPANY_SITE_GUID,
            COMPANY_CONTACT_NO:this.COMPANY_CONTACT_NO,
            CREATION_TS:this.CREATION_TS,
            CREATION_USER_GUID:this.CREATION_USER_GUID,
            UPDATE_TS:this.UPDATE_TS,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}

