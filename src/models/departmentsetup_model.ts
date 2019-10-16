import { Base_NameDescription_Model } from './base_model';
export class DepartmentSetup_Model extends Base_NameDescription_Model {
	constructor() {
		super();
	}

	public DEPARTMENT_GUID: string = null;
	public TENANT_GUID: string = null;


	static fromJson(json: any) {
		if (!json) return;
		return (
			json.DEPARTMENT_GUID,
			json.NAME,
			//json.COMPANY,
			json.DESCRIPTION,
			json.CREATION_TS,
			json.CREATION_USER_GUID,
			json.UPDATE_TS,
			json.UPDATE_USER_GUID,
			json.TENANT_GUID
		);
	}

	toJson(stringify?: boolean): any {
		var doc = {
			DEPARTMENT_GUID: this.DEPARTMENT_GUID,
			NAME: this.NAME,
			//COMPANY: this.COMPANY,
			DESCRIPTION: this.DESCRIPTION,
			CREATION_TS: this.CREATION_TS,
			CREATION_USER_GUID: this.CREATION_USER_GUID,
			UPDATE_TS: this.UPDATE_TS,
			UPDATE_USER_GUID: this.UPDATE_USER_GUID,
			TENANT_GUID: this.TENANT_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}