export class Main_Attendance_Model {
    constructor(
        public user_id: string = null,
        public employee_code: string = null,
        public employee_name: string = null,
        public dept: string = null,
        public attendance_time: string = null,
        public att_id: string = null,
        public dev_id: string = null,
        public photo_id: string = null,

        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null
    ) { }
    static fromJson(json: any) {
        if (!json) return;
        return new Main_Attendance_Model(
            json.user_id,
            json.employee_code,
            json.employee_name,
            json.dept,
            json.attendance_time,
            json.att_id,
            json.dev_id,
            json.photo_id,

            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
        );
    }
    toJson(stringify?: boolean): any {
        var doc = {
            user_id: this.user_id,
            employee_code: this.employee_code,
            employee_name: this.employee_name,
            dept: this.dept,
            attendance_time: this.attendance_time,
            att_id: this.att_id,
            dev_id: this.dev_id,
            photo_id: this.photo_id,
            
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}