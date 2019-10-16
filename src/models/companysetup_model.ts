export class CompanySetup_Model {
	constructor(
		public COMPANY_GUID: string = null,
		public NAME: string = null,		
	 	public REGISTRATION_NO: string = null,
        public ADDRESS: string = null,
        public FAX: string = null,
        public PHONE: string = null,
        public EMAIL: string = null,
		public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null
    ) { }
    
    static fromJson(json: any) {
		if (!json) return;
		return new CompanySetup_Model(
			json.COMPANY_GUID,
		    json.NAME,
			json.REGISTRATION_NO,
            json.ADDRESS,
            json.FAX,
            json.PHONE,
            json.EMAIL,
			json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
		);
    }

    toJson(stringify?: boolean): any {
		var doc = {
			COMPANY_GUID:this.COMPANY_GUID,
			NAME:this.NAME,
			REGISTRATION_NO:this.REGISTRATION_NO,
            ADDRESS:this.ADDRESS,
            FAX:this.FAX,
            PHONE:this.PHONE,
            EMAIL:this.EMAIL,
			CREATION_TS:this.CREATION_TS,
            CREATION_USER_GUID:this.CREATION_USER_GUID,
            UPDATE_TS:this.UPDATE_TS,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}
