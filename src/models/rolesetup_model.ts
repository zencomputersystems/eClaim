import { Base_NameDescription_Model } from './base_model';
export class RoleSetup_Model extends Base_NameDescription_Model {
	constructor() {
		super();
	}

	public ROLE_GUID: string = null;
	public TENANT_GUID: string = null;
	public ACTIVATION_FLAG: string = null;
	public KEY_ADD: string = null;
	public KEY_EDIT: string = null;
	public KEY_DELETE: string = null;
	public KEY_VIEW: string = null;
	public ROLE_PRIORITY_LEVEL: string = null;

	static fromJson(json: RoleSetup_Model) {
		if (!json) return;
		return (
			json.ROLE_GUID,
			json.NAME,
			json.DESCRIPTION,
			json.TENANT_GUID,
			json.ACTIVATION_FLAG,
			json.CREATION_TS,
			json.CREATION_USER_GUID,
			json.UPDATE_TS,
			json.UPDATE_USER_GUID,

			json.KEY_ADD,
			json.KEY_EDIT,
			json.KEY_DELETE,
			json.KEY_VIEW,
			json.ROLE_PRIORITY_LEVEL
		);
	}

	toJson(stringify?: boolean): any {
		var doc = {
			ROLE_GUID: this.ROLE_GUID,
			NAME: this.NAME,
			DESCRIPTION: this.DESCRIPTION,
			TENANT_GUID: this.TENANT_GUID,
			ACTIVATION_FLAG: this.ACTIVATION_FLAG,
			CREATION_TS: this.CREATION_TS,
			CREATION_USER_GUID: this.CREATION_USER_GUID,
			UPDATE_TS: this.UPDATE_TS,
			UPDATE_USER_GUID: this.UPDATE_USER_GUID,

			KEY_ADD: this.KEY_ADD,
			KEY_EDIT: this.KEY_EDIT,
			KEY_DELETE: this.KEY_DELETE,
			KEY_VIEW: this.KEY_VIEW,
			ROLE_PRIORITY_LEVEL: this.ROLE_PRIORITY_LEVEL
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



