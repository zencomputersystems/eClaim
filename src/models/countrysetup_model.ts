export class CountrySetup_Model {
	constructor(
		public COUNTRY_GUID: string = null,
		public NAME: string = null,
		public CREATION_TS: string = null,
		public CREATION_USER_GUID: string = null,
		public UPDATE_TS: string = null,
		public UPDATE_USER_GUID: string = null
	) { }


	static fromJson(json: any) {
		if (!json) return;
		return new CountrySetup_Model(
			json.COUNTRY_GUID,
			json.NAME,
			json.CREATION_TS,
			json.CREATION_USER_GUID,
			json.UPDATE_TS,
			json.UPDATE_USER_GUID
		);
	}

	toJson(stringify?: boolean): any {
		var doc = {
			COUNTRY_GUID: this.COUNTRY_GUID,
			NAME: this.NAME,
			CREATION_TS: this.CREATION_TS,
			CREATION_USER_GUID: this.CREATION_USER_GUID,
			UPDATE_TS: this.UPDATE_TS,
			UPDATE_USER_GUID: this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



