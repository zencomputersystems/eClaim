import { Base_NameDescription_Model } from './base_model';
export class PageSetup_Model extends Base_NameDescription_Model {
	constructor() {
		super();
	}

	public PAGE_GUID: string = null;
	public URL: string = null;
	public CODE_PAGE_NAME: string = null;


	static fromJson(json: PageSetup_Model) {
		if (!json) return;
		return (
			json.PAGE_GUID,
			json.NAME,
			json.DESCRIPTION,
			json.URL,
			json.CREATION_TS,
			json.CREATION_USER_GUID,
			json.UPDATE_TS,
			json.UPDATE_USER_GUID,
			json.CODE_PAGE_NAME
		);
	}

	toJson(stringify?: boolean): any {
		var doc = {
			PAGE_GUID: this.PAGE_GUID,
			NAME: this.NAME,
			DESCRIPTION: this.DESCRIPTION,
			URL: this.URL,
			CREATION_TS: this.CREATION_TS,
			CREATION_USER_GUID: this.CREATION_USER_GUID,
			UPDATE_TS: this.UPDATE_TS,
			UPDATE_USER_GUID: this.UPDATE_USER_GUID,
			CODE_PAGE_NAME: this.CODE_PAGE_NAME
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}