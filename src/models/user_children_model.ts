import { Base_Model } from './base_model';
export class UserChildren_Model extends Base_Model {
    constructor() {
        super();
    }

    public CHILD_GUID: string = null;
    public NAME: string = null;
    public ICNO: string = null;
    public GENDER: string = null;
    public SPOUSE: string = null;
    public USER_GUID: string = null;


    static fromJson(json: UserChildren_Model) {
        if (!json) return;
        return (
            json.CHILD_GUID,
            json.NAME,
            json.ICNO,
            json.GENDER,
            json.SPOUSE,
            json.USER_GUID,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
        );
    }

    toJson(stringify?: boolean): any {
        var doc = {
            CHILD_GUID: this.CHILD_GUID,
            NAME: this.NAME,
            ICNO: this.ICNO,
            GENDER: this.GENDER,
            SPOUSE: this.SPOUSE,
            USER_GUID: this.USER_GUID,
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}