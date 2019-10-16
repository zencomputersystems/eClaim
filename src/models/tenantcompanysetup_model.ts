export class TenantCompanySetup_Model {
      constructor(
            public TENANT_COMPANY_GUID: string = null,
            public TENANT_GUID: string = null,
            public NAME: string = null,
            public REGISTRATION_NO: string = null,
            public ACTIVATION_FLAG: string = null,
            public CREATION_TS: string = null,
            public CREATION_USER_GUID: string = null,
            public UPDATE_TS: string = null,
            public UPDATE_USER_GUID: string = null,
      ) { }
      static fromJson(json: any) {
            if (!json) return;
            return new TenantCompanySetup_Model(
                  json.TENANT_COMPANY_GUID,
                  json.TENANT_GUID,
                  json.NAME,
                  json.REGISTRATION_NO,
                  json.ACTIVATION_FLAG,
                  json.CREATION_TS,
                  json.CREATION_USER_GUID,
                  json.UPDATE_TS,
                  json.UPDATE_USER_GUID
            );
      }
      toJson(stringify?: boolean): any {
            var doc = {
                  TENANT_COMPANY_GUID: this.TENANT_COMPANY_GUID,
                  TENANT_GUID: this.TENANT_GUID,
                  NAME: this.NAME,
                  REGISTRATION_NO: this.REGISTRATION_NO,
                  ACTIVATION_FLAG: this.ACTIVATION_FLAG,
                  CREATION_TS: this.CREATION_TS,
                  CREATION_USER_GUID: this.CREATION_USER_GUID,
                  UPDATE_TS: this.UPDATE_TS,
                  UPDATE_USER_GUID: this.UPDATE_USER_GUID
            };
            return stringify ? JSON.stringify({ resource: [doc] }) : doc;
      }
}

