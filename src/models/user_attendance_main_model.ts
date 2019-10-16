export class User_Attendance_Main_Model {
    constructor(
        public USER_ATTENDANCE_GUID: string = null,
        public USER_GUID: string = null,
        public ATTENDANCE_DATE: string = null,
        public IN_TS: string = null,
        public OUT_TS: string = null,
        public WORKING_HOURS: string = null,
        public OVERTIME_FLAG: string = null,

        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null,
    ) { }
    static fromJson(json: any) {
        if (!json) return;
        return new User_Attendance_Main_Model(
            json.USER_ATTENDANCE_GUID,
            json.USER_GUID,
            json.ATTENDANCE_DATE,
            json.IN_TS,
            json.OUT_TS,
            json.WORKING_HOURS,
            json.OVERTIME_FLAG,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
        );
    }
    toJson(stringify?: boolean): any {
        var doc = {
            USER_ATTENDANCE_GUID: this.USER_ATTENDANCE_GUID,
            USER_GUID: this.USER_GUID,
            ATTENDANCE_DATE: this.ATTENDANCE_DATE,
            IN_TS: this.IN_TS,
            OUT_TS: this.OUT_TS,
            WORKING_HOURS: this.WORKING_HOURS,
            OVERTIME_FLAG: this.OVERTIME_FLAG,

            CREATION_TS: this.CREATION_TS,            
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}