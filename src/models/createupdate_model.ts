export class CreateUpdate_Model {
	constructor(

		public CREATION_TS: string = null,
		public CREATION_USER_GUID: string = null,
		public UPDATE_TS: string = null,
		public UPDATE_USER_GUID: string = null,
	) { }


	static fromJson(json: any) {
		if (!json) return;
		return new CreateUpdate_Model(
			json.CREATION_TS,
			json.CREATION_USER_GUID,
			json.UPDATE_TS,
			json.UPDATE_USER_GUID,
		);
	}

	toJson(stringify?: boolean): any {
		var doc = {
			CREATION_TS: this.CREATION_TS,
			CREATION_USER_GUID: this.CREATION_USER_GUID,
			UPDATE_TS: this.UPDATE_TS,
			UPDATE_USER_GUID: this.UPDATE_USER_GUID,
		};
		return stringify ? JSON.stringify(this) : doc;
	}
}