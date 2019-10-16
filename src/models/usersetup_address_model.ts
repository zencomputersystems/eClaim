export class UserAddress_Model {
    constructor(
        public USER_ADDRESS_GUID: string = null,
        public USER_GUID: string = null,
        public ADDRESS_TYPE: string = null,
        public USER_ADDRESS1: string = null,
        public USER_ADDRESS2: string = null,
        public USER_ADDRESS3: string = null,
        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null,
        public POST_CODE: string = null,
        public COUNTRY_GUID: string = null,
        public STATE_GUID: string = null
    ) { }
    static fromJson(json: any) {
        if (!json) return;
        return new UserAddress_Model(
            json.USER_ADDRESS_GUID,
            json.USER_GUID,
            json.ADDRESS_TYPE,
            json.USER_ADDRESS1,
            json.USER_ADDRESS2,
            json.USER_ADDRESS3,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID,
            json.POST_CODE,
            json.COUNTRY_GUID,
            json.STATE_GUID,

        );
    }
    toJson(stringify?: boolean): any {
        var doc = {
            USER_ADDRESS_GUID: this.USER_ADDRESS_GUID,
            USER_GUID: this.USER_GUID,
            ADDRESS_TYPE: this.ADDRESS_TYPE,
            USER_ADDRESS1: this.USER_ADDRESS1,
            USER_ADDRESS2: this.USER_ADDRESS2,
            USER_ADDRESS3: this.USER_ADDRESS3,
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID,
            POST_CODE: this.POST_CODE,
            COUNTRY_GUID: this.COUNTRY_GUID,
            STATE_GUID: this.STATE_GUID,
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}

