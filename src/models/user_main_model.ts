export class UserMain_Model {
    constructor(
        public USER_GUID: string = null,
        public TENANT_GUID: string = null,
        public STAFF_ID: string = null,
        public LOGIN_ID: string = null,
        public PASSWORD: string = null,
        public EMAIL: string = null,
        public ACTIVATION_FLAG: number = 1,
        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null,
        public IS_TENANT_ADMIN: string = null
    ) { }
    static fromJson(json: any) {
        if (!json) return;
        return new UserMain_Model(
            json.USER_GUID,
            json.TENANT_GUID,
            json.STAFF_ID,
            json.LOGIN_ID,
            json.PASSWORD,
            json.EMAIL,
            json.ACTIVATION_FLAG,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID,
            json.IS_TENANT_ADMIN
        );
    }
    toJson(stringify?: boolean): any {
        var doc = {
            USER_GUID: this.USER_GUID,
            TENANT_GUID: this.TENANT_GUID,
            STAFF_ID: this.STAFF_ID,
            LOGIN_ID: this.LOGIN_ID,
            PASSWORD: this.PASSWORD,
            EMAIL: this.EMAIL,
            ACTIVATION_FLAG: this.ACTIVATION_FLAG,
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID,
            IS_TENANT_ADMIN: this.IS_TENANT_ADMIN
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}

