import { Base_Model } from './base_model';
export class RoleModuleSetup_Model extends Base_Model {
    constructor() {
        super();
    }

    public ROLE_MODULE_GUID: string = null;
    public ROLE_GUID: string = null;
    public MODULE_GUID: string = null;
    public MODULE_SLNO: string = null;
    public MODULE_FLAG: string = null;


    static fromJson(json: RoleModuleSetup_Model) {
        if (!json) return;
        return (
            json.ROLE_MODULE_GUID,
            json.ROLE_GUID,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID,
            json.MODULE_SLNO,
            json.MODULE_FLAG
        );
    }

    toJson(stringify?: boolean): any {
        var doc = {
            ROLE_MODULE_GUID: this.ROLE_MODULE_GUID,
            ROLE_GUID: this.ROLE_GUID,
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID,
            MODULE_SLNO: this.MODULE_SLNO,
            MODULE_FLAG: this.MODULE_FLAG
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}