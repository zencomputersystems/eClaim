export class UserInfo_Model {
	constructor(
        public USER_INFO_GUID: string = null,
        public USER_GUID: string = null,
        public FULLNAME: string = null,
        public NICKNAME: string = null,
        public SALUTATION: string = null,
        public MANAGER_USER_GUID: string = null,
        public PERSONAL_ID_TYPE: string = null,
        public PERSONAL_ID: string = null,
        public DOB: string = null,
        public GENDER: string = null,
        public JOIN_DATE: string = null,
        public MARITAL_STATUS: string = null,
        public BRANCH: string = null,
        public EMPLOYEE_TYPE: string = null,
        public APPROVER1: string = null,
        public APPROVER2: string = null,
        public EMPLOYEE_STATUS: string = null,
        public DEPT_GUID: string = null,
        public DESIGNATION_GUID: string = null,
        public RESIGNATION_DATE: string = null,
        public TENANT_COMPANY_GUID: string = null,
        public CONFIRMATION_DATE: string = null,
        public TENANT_COMPANY_SITE_GUID: string = null,
        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null
    ) { }
    static fromJson(json: any) {
		if (!json) return;
		return new UserInfo_Model(
			json.USER_INFO_GUID,
		    json.USER_GUID,
			json.FULLNAME,
            json.NICKNAME,
            json.SALUTATION,
            json.MANAGER_USER_GUID,
            json.PERSONAL_ID_TYPE,
            json.PERSONAL_ID,
            json.DOB,
            json.GENDER,
            json.JOIN_DATE,
            json.MARITAL_STATUS,
            json.BRANCH,
            json.EMPLOYEE_TYPE,
            json.APPROVER1,
            json.APPROVER2,
            json.EMPLOYEE_STATUS,
            json.DEPT_GUID,
            json.DESIGNATION_GUID,
            json.RESIGNATION_DATE,
            json.TENANT_COMPANY_GUID,
            json.CONFIRMATION_DATE,
            json.TENANT_COMPANY_SITE_GUID,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
            
		);
    }
    toJson(stringify?: boolean): any {
		var doc = {
			USER_INFO_GUID:this.USER_INFO_GUID,
			//USER_GUID:this.USER_GUID,
			FULLNAME:this.FULLNAME,
            NICKNAME:this.NICKNAME,
            SALUTATION:this.SALUTATION,
            MANAGER_USER_GUID:this.MANAGER_USER_GUID,
            PERSONAL_ID_TYPE:this.PERSONAL_ID_TYPE,
            PERSONAL_ID:this.PERSONAL_ID,
            DOB:this.DOB,
            GENDER:this.GENDER,
            JOIN_DATE:this.JOIN_DATE,
            MARITAL_STATUS:this.MARITAL_STATUS,
            BRANCH:this.BRANCH,
            EMPLOYEE_TYPE:this.EMPLOYEE_TYPE,
            APPROVER1:this.APPROVER1,
            APPROVER2:this.APPROVER2,
            EMPLOYEE_STATUS:this.EMPLOYEE_STATUS,
            DEPT_GUID:this.DEPT_GUID,
            DESIGNATION_GUID:this.DESIGNATION_GUID,
            RESIGNATION_DATE:this.RESIGNATION_DATE,
            TENANT_COMPANY_GUID:this.TENANT_COMPANY_GUID,
            CONFIRMATION_DATE:this.CONFIRMATION_DATE,
            TENANT_COMPANY_SITE_GUID:this.TENANT_COMPANY_SITE_GUID,
            CREATION_TS:this.CREATION_TS,
            CREATION_USER_GUID:this.CREATION_USER_GUID,
            UPDATE_TS:this.UPDATE_TS,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}

