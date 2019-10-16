export class Main_Profile_Model {
	constructor(
		public MAIN_PROFILE_GUID: string = null,
		public PROFILE_NAME: string = null,
		public PROFILE_XML: string = null,
		public TENANT_GUID: string = null,
		public TENANT_SITE_GUID: string = null,
		public CREATION_TS: string = null,
		public CREATION_USER_GUID: string = null,
		public UPDATE_TS: string = null,
		public UPDATE_USER_GUID: string = null,
		public PROFILE_JSON: string = null
	) { }


	static fromJson(json: any) {
		if (!json) return;
		return new Main_Profile_Model(
			json.MAIN_PROFILE_GUID,
			json.PROFILE_NAME,
			json.PROFILE_XML,
			json.TENANT_GUID,
			json.TENANT_SITE_GUID,
			json.CREATION_TS,
			json.CREATION_USER_GUID,
			json.UPDATE_TS,
			json.UPDATE_USER_GUID,
			json.PROFILE_JSON
		);
	}

	toJson(stringify?: boolean): any {
		var doc = {
			MAIN_PROFILE_GUID: this.MAIN_PROFILE_GUID,
			PROFILE_NAME: this.PROFILE_NAME,
			PROFILE_XML: this.PROFILE_XML,
			TENANT_GUID: this.TENANT_GUID,
			TENANT_SITE_GUID: this.TENANT_SITE_GUID,
			CREATION_TS: this.CREATION_TS,
			CREATION_USER_GUID: this.CREATION_USER_GUID,
			UPDATE_TS: this.UPDATE_TS,
			UPDATE_USER_GUID: this.UPDATE_USER_GUID,
			PROFILE_JSON: this.PROFILE_JSON
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}