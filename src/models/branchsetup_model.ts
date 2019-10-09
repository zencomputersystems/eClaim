import { Base_Model } from './base_model';
export class BranchSetup_Model extends Base_Model {
	constructor() {
		super();
	}

	public BRANCH_GUID: string = null;
	public NAME: string = null;

	static fromJson(json: any) {
		if (!json) return;
		return (
			json.BRANCH_GUID,
		    json.NAME,
			json.CREATION_TS,
			json.CREATION_USER_GUID,
			json.UPDATE_TS,
			json.UPDATE_USER_GUID
		);
    }
    
	toJson(stringify?: boolean): any {
		var doc = {
			BRANCH_GUID:this.BRANCH_GUID,
			NAME:this.NAME,
			CREATION_TS:this.CREATION_TS,
			CREATION_USER_GUID:this.CREATION_USER_GUID,
			UPDATE_TS:this.UPDATE_TS,
			UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



