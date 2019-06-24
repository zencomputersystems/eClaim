import { Base_Activation_Model } from './base_model';
export class TenantCompanySetup_Model extends Base_Activation_Model {
      constructor() {
            super();
      }

      public TENANT_COMPANY_GUID: string = null;
      public TENANT_GUID: string = null;
      public NAME: string = null;
      public REGISTRATION_NO: string = null;

      static fromJson(json: TenantCompanySetup_Model) {
            if (!json) return;
            return (
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

