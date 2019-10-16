export class Device_Raw_Data_Model {
    constructor(
        public RAW_DATA_GUID: string = null,
        public DEVICE_GUID: string = null,
        public REF_NO: string = null,
        public DATA_ENTRY_TS: string = null,

        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null,
    ) { }
    static fromJson(json: any) {
        if (!json) return;
        return new Device_Raw_Data_Model(
            json.RAW_DATA_GUID,
            json.DEVICE_GUID,
            json.REF_NO,
            json.DATA_ENTRY_TS,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
        );
    }
    toJson(stringify?: boolean): any {
        var doc = {
            RAW_DATA_GUID: this.RAW_DATA_GUID,
            DEVICE_GUID: this.DEVICE_GUID,
            REF_NO: this.REF_NO,
            DATA_ENTRY_TS: this.DATA_ENTRY_TS,
            CREATION_TS: this.CREATION_TS,
            
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}