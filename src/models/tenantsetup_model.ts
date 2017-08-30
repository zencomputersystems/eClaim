export class TenantSetup_Model {
	constructor(
        public TENANT_COMPANY_SITE_GUID: string = null,
        public TENANT_COMPANY_GUID: string = null,
        public SITE_NAME: string = null,
        public REGISTRATION_NUM: string = null,
        public ADDRESS1: string = null,
        public ADDRESS2: string = null,
        public ADDRESS3: string = null,
        public CONTACT_NO: string = null,
        public EMAIL: string = null,
        public ACTIVATION_FLAG: string = null,
        public CONTACT_PERSON: string = null,
        public CONTACT_PERSON_CONTACT_NO: string = null,
        public CONTACT_PERSON_EMAIL: string = null,
        public WEBSITE: string = null,
        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null
    ) { }
    static fromJson(json: any) {
		if (!json) return;
		return new TenantSetup_Model(
			json.TENANT_COMPANY_SITE_GUID,
		    json.TENANT_COMPANY_GUID,
			json.SITE_NAME,
            json.REGISTRATION_NUM,
            json.ADDRESS1,
            json.ADDRESS2,
            json.ADDRESS3,
            json.CONTACT_NO,
            json.EMAIL,
            json.ACTIVATION_FLAG,
            json.CONTACT_PERSON,
            json.CONTACT_PERSON_CONTACT_NO,
            json.CONTACT_PERSON_EMAIL,
            json.WEBSITE,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
            
		);
    }
    toJson(stringify?: boolean): any {
		var doc = {
			TENANT_COMPANY_SITE_GUID:this.TENANT_COMPANY_SITE_GUID,
			TENANT_COMPANY_GUID:this.TENANT_COMPANY_GUID,
			SITE_NAME:this.SITE_NAME,
            REGISTRATION_NUM:this.REGISTRATION_NUM,
            ADDRESS1:this.ADDRESS1,
            ADDRESS2:this.ADDRESS2,
            ADDRESS3:this.ADDRESS3,
            CONTACT_NO:this.CONTACT_NO,
            EMAIL:this.EMAIL,
            ACTIVATION_FLAG:this.ACTIVATION_FLAG,
            CONTACT_PERSON:this.CONTACT_PERSON,
            CONTACT_PERSON_CONTACT_NO:this.CONTACT_PERSON_CONTACT_NO,
            CONTACT_PERSON_EMAIL:this.CONTACT_PERSON_EMAIL,
            WEBSITE:this.WEBSITE,
            CREATION_TS:this.CREATION_TS,
            CREATION_USER_GUID:this.CREATION_USER_GUID,
            UPDATE_TS:this.UPDATE_TS,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}

