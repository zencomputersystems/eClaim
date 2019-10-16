import { Base_Model } from './base_model';
export class SubsciptionSetup_Model extends Base_Model {
	constructor() {
    super();
  }

  public SUBSCRIPTION_GUID: string = null;
  public PLAN_NAME: string = null;
  public DURATION: string = null;
  public RATE: string = null;
  public EFFECTIVE_DATE: string = null;
  public DESCRIPTION: string = null;
  public ACTIVE_FLAG: string = null;
  public TENANT_GUID: string = null;

    static fromJson(json: any) {
		if (!json) return;
		return (
			json.SUBSCRIPTION_GUID,
		    json.PLAN_NAME,
			json.DURATION,
			json.RATE,
            json.EFFECTIVE_DATE,
            json.DESCRIPTION,
            json.ACTIVE_FLAG,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.TENANT_GUID,
            json.UPDATE_USER_GUID
		);
    }
    
    toJson(stringify?: boolean): any {
		var doc = {
			SUBSCRIPTION_GUID:this.SUBSCRIPTION_GUID,
			PLAN_NAME:this.PLAN_NAME,
			DURATION:this.DURATION,
			RATE:this.RATE,
            EFFECTIVE_DATE:this.EFFECTIVE_DATE,
            DESCRIPTION:this.DESCRIPTION,
            ACTIVE_FLAG:this.ACTIVE_FLAG,
            CREATION_TS:this.CREATION_TS,
            CREATION_USER_GUID:this.CREATION_USER_GUID,
            UPDATE_TS:this.UPDATE_TS,
            TENANT_GUID:this.TENANT_GUID,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}

