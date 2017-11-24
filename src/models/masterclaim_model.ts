export class MasterClaim_Model {
	constructor(
        public CLAIM_REQUEST_GUID: string = null,
        public SOC_GUID: string = null,
        public TENANT_GUID: string = null,
        public CLAIM_REF_GUID: string = null,
        public CLAIM_TYPE_GUID: string = null,
        public START_TS: string = null,
        public END_TS: string = null,
        public FROM: string = null,
        public DESTINATION: string = null,
        public DISTANCE_KM: string = null,
        public CLAIM_AMOUNT: string = null,
        public CALENDAR_REF: string = null,
        public CUSTOMER_NAME: string = null,
        public CUSTOMER_ADDRESS1: string = null,
        public CUSTOMER_ADDRESS2: string = null,
        public CUSTOMER_ADDRESS3: string = null,
        public CLAIM_DATE: string = null,
        public STATUS: string = null,
        public STATUS_REMARKS: string = null,
        public STAGE: string = null,
        public STAGE_REMARKS: string = null,
        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null,
	) { }


	static fromJson(json: any) {
		if (!json) return;
		return new MasterClaim_Model(
			json.CLAIM_REQUEST_GUID,
		    json.SOC_GUID,
			json.TENANT_GUID,
            json.CLAIM_REF_GUID,
            json.CLAIM_TYPE_GUID,
            json.START_TS,
            json.END_TS,
            json.FROM,
            json.DESTINATION,
            json.DISTANCE_KM,
            json.CLAIM_AMOUNT,
            json.CALENDAR_REF,
			json.CUSTOMER_NAME,
            json.CUSTOMER_ADDRESS1,
            json.CUSTOMER_ADDRESS2,
            json.CUSTOMER_ADDRESS3,
            json.CLAIM_DATE,
            json.STATUS,
            json.STATUS_REMARKS,
            json.STAGE,
            json.STAGE_REMARKS,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
		);
    }
    
	toJson(stringify?: boolean): any {
		var doc = {
            CLAIM_REQUEST_GUID:this.CLAIM_REQUEST_GUID,
            SOC_GUID:this.SOC_GUID,
			TENANT_GUID:this.TENANT_GUID,
            CLAIM_REF_GUID:this.CLAIM_REF_GUID,
            CLAIM_TYPE_GUID:this.CLAIM_TYPE_GUID,
            START_TS:this.START_TS,
            END_TS:this.END_TS,
            FROM:this.FROM,
            DESTINATION:this.DESTINATION,
            DISTANCE_KM:this.DISTANCE_KM,
            CLAIM_AMOUNT:this.CLAIM_AMOUNT,
            CALENDAR_REF:this.CALENDAR_REF,
			CUSTOMER_NAME:this.CUSTOMER_NAME,
            CUSTOMER_ADDRESS1:this.CUSTOMER_ADDRESS1,
            CUSTOMER_ADDRESS2:this.CUSTOMER_ADDRESS2,
            CUSTOMER_ADDRESS3:this.CUSTOMER_ADDRESS3,
            CLAIM_DATE:this.CLAIM_DATE,
            STATUS:this.STATUS,
            STATUS_REMARKS:this.STATUS_REMARKS,
            STAGE:this.STAGE,
            STAGE_REMARKS:this.STAGE_REMARKS,
            CREATION_TS:this.CREATION_TS,
            CREATION_USER_GUID:this.CREATION_USER_GUID,
            UPDATE_TS:this.UPDATE_TS,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}
