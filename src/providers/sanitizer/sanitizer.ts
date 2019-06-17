import { DREAMFACTORY_IMAGE_URL, DREAMFACTORY_TABLE_URL, DREAMFACTORY_API_KEY, DREAMFACTORY_TEMPLATE_URL, DREAMFACTORY_EMAIL_URL } from './../../app/config/constants';
import { Injectable } from '@angular/core';

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
  if (typeof providedUrl === 'string') return providedUrl.trim().replace(/\/\//g, "/").replace(":/", "://") || "-1"
}

export type serviceTypeDef = {
  'table': '_table/';
  'image': 'azurefs/eclaim/';
  'file': 'azurefs/eclaim/';
  'template': 'azurefs/Template/';
  'email': 'zenmail';
};

export type filterConnectorDef = 'AND' | 'OR'


/**
 * Generate usable URL
 *
 * @export
 * @param {keyof serviceTypeDef} serviceType
 * @param {string} resourceName
 * @param {string[]} [filters]
 * @param {filterConnectorDef} [filterConnector]
 * @returns
 */
export function getURL(serviceType: keyof serviceTypeDef, resourceName?: string, filters: string[] = [], filterConnector: filterConnectorDef = "AND") {
  var urlstring: string;
switch (serviceType) {
  case 'file': { urlstring = `${DREAMFACTORY_IMAGE_URL}/${resourceName}?api_key=${DREAMFACTORY_API_KEY}`; break };
  case 'table': { 
    urlstring = `${DREAMFACTORY_TABLE_URL}/${resourceName}?api_key=${DREAMFACTORY_API_KEY}`; 
    let filter = (filters.length>0) ? `&filter=${parseFilter(filters,filterConnector)}` : "" ;
    urlstring = urlstring + filter;
    break };
  case 'image': { urlstring = `${DREAMFACTORY_IMAGE_URL}/${resourceName}?api_key=${DREAMFACTORY_API_KEY}`; break };
  case 'template': { urlstring = `${DREAMFACTORY_TEMPLATE_URL}/${resourceName}?api_key=${DREAMFACTORY_API_KEY}`; break; }
  case 'email': { urlstring = `${DREAMFACTORY_EMAIL_URL}?api_key=${DREAMFACTORY_API_KEY}`; break; }
}
  return sanitizeURL(urlstring);
}

function parseFilter(filters: string[], filterConnector: filterConnectorDef) {
  let ARG = `(${filters.shift()})`;
  if (filters.length > 0) {
    filters.forEach(argument => {
      ARG = `${ARG}${filterConnector}(${argument})`
    })
  };
  return ARG
};