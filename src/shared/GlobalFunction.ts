import CryptoJS from "crypto-js";

export function  Random(): string {
    let rand = Math.random().toString(10).substring(2, 8)
    return rand;
  }

export function EncryptPassword(password: string): string {
  return CryptoJS.SHA256(password.trim()).toString(CryptoJS.enc.Hex)
}

export function getKeyByValue(object: any, value: any) { 
  return Object.keys(object).find(key =>  
          object[key] === value)
  }