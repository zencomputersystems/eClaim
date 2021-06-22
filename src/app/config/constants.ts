
export const DREAMFACTORY_API_KEY: string = process.env.DREAMFACTORY_API_KEY;
export const DREAMFACTORY_INSTANCE_URL: string = process.env.DREAMFACTORY_INSTANCE_URL;  
export const AD_URL: string = process.env.AD_URL;
export const DREAMFACTORY_IMAGE_URL: string = `${DREAMFACTORY_INSTANCE_URL}/api/v2/azurefs/eclaim/`;
export const IMAGE_VIEW_URL = "https://zencloudservicesstore.blob.core.windows.net/cloudservices/eclaim/";
export const SAS_QUERY_STRING = '';
export const DREAMFACTORY_TABLE_URL: string = `${DREAMFACTORY_INSTANCE_URL}/api/v2/zcs/_table/`;
export const DREAMFACTORY_TEMPLATE_URL: string = `${DREAMFACTORY_INSTANCE_URL}/api/v2/azurefs/templates/`;
export const DREAMFACTORY_EMAIL_URL: string =  `${DREAMFACTORY_INSTANCE_URL}/api/v2/sendgrid?api_key=${process.env.EMAIL_KEY}`;
// export const AD_URL: string = "http://localhost:8100/";

