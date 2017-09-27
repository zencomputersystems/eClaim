export class BankSetup_Model {
	constructor(
		public BANK_GUID: string = null,
		public NAME: string = null,
		public DESCRIPTION: string = null,
		public TENANT_GUID: string = null,
		public CREATION_TS: string = null,
		public CREATION_USER_GUID: string = null,
		public UPDATE_TS: string = null,
		public UPDATE_USER_GUID: string = null
	) { }


	static fromJson(json: any) {
		if (!json) return;
		return new BankSetup_Model(
			json.BANK_GUID,
		    json.NAME,
			json.DESCRIPTION,
			json.TENANT_GUID,
			json.CREATION_TS,
			json.CREATION_USER_GUID,
			json.UPDATE_TS,
			json.UPDATE_USER_GUID
		);
    }
    
	toJson(stringify?: boolean): any {
		var doc = {
			BANK_GUID:this.BANK_GUID,
			
			NAME:this.NAME,
            DESCRIPTION:this.DESCRIPTION,
			TENANT_GUID:this.TENANT_GUID,
			CREATION_TS:this.CREATION_TS,
			CREATION_USER_GUID:this.CREATION_USER_GUID,
			UPDATE_TS:this.UPDATE_TS,
			UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



