export class RoleModuleSetup_Model {
    constructor(
        public ROLE_MODULE_GUID: string = null,
        public ROLE_GUID: string = null,
        public MODULE_GUID: string = null,
        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null,
    ) { }


    static fromJson(json: any) {
        if (!json) return;
        return new RoleModuleSetup_Model(
            json.ROLE_MODULE_GUID,
            json.ROLE_GUID,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
        );
    }

    toJson(stringify?: boolean): any {
        var doc = {
            ROLE_MODULE_GUID: this.ROLE_MODULE_GUID,
            ROLE_GUID: this.ROLE_GUID,
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}