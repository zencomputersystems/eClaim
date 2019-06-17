import { DREAMFACTORY_API_KEY } from "../app/config/constants";

let eHeaders = new Headers();
eHeaders.append('Content-Type', 'application/json');
eHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);

export const postHeaders = eHeaders;

console.log("eHeaders: ", eHeaders);