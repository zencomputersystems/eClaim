import { Injectable } from '@angular/core';
import { urlsanitizer } from '@zencloudservices/urlsanitizer';
import { DREAMFACTORY_API_KEY, DREAMFACTORY_EMAIL_URL, DREAMFACTORY_IMAGE_URL, DREAMFACTORY_INSTANCE_URL, DREAMFACTORY_TABLE_URL, DREAMFACTORY_TEMPLATE_URL } from './../../app/config/constants';


/*
  Generated class for the SanitizerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SanitizerProvider {

  constructor() {
  }


}
export function sanitizeURL(providedUrl: string) {
  //  if (typeof providedUrl === 'string') return providedUrl.trim().replace(/\/\//g, "/").replace(":/", "://") || "-1"
  return urlsanitizer(providedUrl);
}

export type serviceTypeDef = {
  'table': '_table/';
  'image': 'azurefs/eclaim/';
  'file': 'azurefs/eclaim/';
  'template': 'azurefs/Template/';
  'email': 'zenmail';
  'distance': 'google/distancematrix/json';
};

export type filterConnectorDef = 'AND' | 'OR'

/**
 * Generate usable URL to fetch data.
 * At the moment, the URL produced can only be used to GET data. Other type of HTTP actions are not supported yet.
 *
 * @export
 * @param {keyof serviceTypeDef} serviceType Options: file, table, image, template, email, distance
 * @param {string} resourceName Table name
 * @param {string[]} [filters] A single string, or an array of filters in the format of "KEY=value" or "(KEY like 'value')". Defaults to no filter.
 * @param {filterConnectorDef} [filterConnector] Filter operand for array of filters. Only accepts "AND" and "OR". Defaults to "AND". 
 * @returns Full URL
 */
export function getURL(serviceType: keyof serviceTypeDef, resourceName?: string, filters: string[] | string = [], filterConnector: filterConnectorDef = "AND") {
  var urlstring: string;

  switch (serviceType) {
    case 'file': { urlstring = `${DREAMFACTORY_IMAGE_URL}/${resourceName}?api_key=${DREAMFACTORY_API_KEY}`; break };
    case 'table': {
      urlstring = `${DREAMFACTORY_TABLE_URL}/${resourceName}?api_key=${DREAMFACTORY_API_KEY}`;
      let filter = (filters.length > 0) ? `&filter=${parseFilter(filters, filterConnector)}` : "";
      urlstring = urlstring + filter;
      break
    };
    case 'image': { urlstring = `${DREAMFACTORY_IMAGE_URL}/${resourceName}?api_key=${DREAMFACTORY_API_KEY}`; break };
    case 'template': { urlstring = `${DREAMFACTORY_TEMPLATE_URL}/${resourceName}?api_key=${DREAMFACTORY_API_KEY}`; break; }
    case 'email': { urlstring = `${DREAMFACTORY_EMAIL_URL}`; break; }
    case 'distance': { urlstring = `${DREAMFACTORY_INSTANCE_URL}/api/v2/google/distancematrix/json?api_key=${DREAMFACTORY_API_KEY}`; break; }
  }
  return sanitizeURL(urlstring);
}

function parseFilter(filters: string[] | string, filterConnector: filterConnectorDef) {
  var ARG: string;
  if (typeof (filters) === "string") {
    ARG = filters;
  } else {
    ARG = `(${filters.shift()})`;
    if (filters.length > 0) {
      filters.forEach(argument => {
        ARG = `${ARG}${filterConnector}(${argument})`
      })
    };
  }
  return ARG
};