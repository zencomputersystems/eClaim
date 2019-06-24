import { Base_Activation_Model } from './base_model';
export class MileageSetup_Model extends Base_Activation_Model {
	constructor() {
		super();
	}

	public MILEAGE_GUID: string = null;
	public CATEGORY: string = null;
	public RATE_PER_UNIT: string = null;
	public RATE_DATE: string = null;
	public TENANT_GUID: string = null;

	static fromJson(json: MileageSetup_Model) {
		if (!json) return;
		return (
			json.MILEAGE_GUID,
			json.CATEGORY,
			json.RATE_PER_UNIT,
			json.RATE_DATE,
			json.ACTIVATION_FLAG,
			json.CREATION_TS,
			json.CREATION_USER_GUID,
			json.UPDATE_TS,
			json.TENANT_GUID,
			json.UPDATE_USER_GUID
		);
	}

	toJson(stringify?: boolean): any {
		var doc = {
			MILEAGE_GUID: this.MILEAGE_GUID,
			CATEGORY: this.CATEGORY,
			RATE_PER_UNIT: this.RATE_PER_UNIT,
			RATE_DATE: this.RATE_DATE,
			ACTIVATION_FLAG: this.ACTIVATION_FLAG,
			CREATION_TS: this.CREATION_TS,
			CREATION_USER_GUID: this.CREATION_USER_GUID,
			UPDATE_TS: this.UPDATE_TS,
			TENANT_GUID: this.TENANT_GUID,
			UPDATE_USER_GUID: this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



