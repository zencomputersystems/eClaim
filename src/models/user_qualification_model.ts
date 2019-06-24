import { Base_Model } from './base_model';
export class UserQualification_Model extends Base_Model {
    constructor() {
        super();
    }

    public USER_QUALIFICATION_GUID: string = null;
    public QUALIFICATION_GUID: string = null;
    public USER_GUID: string = null;
    public HIGHEST_QUALIFICATION: string = null;
    public MAJOR: string = null;
    public UNIVERSITY: string = null;
    public YEAR: string = null;
    public ATTACHMENT: string = null;

    static fromJson(json: UserQualification_Model) {
        if (!json) return;
        return (
            json.USER_QUALIFICATION_GUID,
            json.QUALIFICATION_GUID,
            json.USER_GUID,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID,
            json.HIGHEST_QUALIFICATION,
            json.MAJOR,
            json.UNIVERSITY,
            json.YEAR,
            json.ATTACHMENT
        );
    }
    toJson(stringify?: boolean): any {
        var doc = {
            USER_QUALIFICATION_GUID: this.USER_QUALIFICATION_GUID,
            QUALIFICATION_GUID: this.QUALIFICATION_GUID,
            USER_GUID: this.USER_GUID,
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID,
            HIGHEST_QUALIFICATION: this.HIGHEST_QUALIFICATION,
            MAJOR: this.MAJOR,
            UNIVERSITY: this.UNIVERSITY,
            YEAR: this.YEAR,
            ATTACHMENT: this.ATTACHMENT
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}