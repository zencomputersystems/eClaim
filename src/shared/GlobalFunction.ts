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

  export function minDate(rejected: boolean = false) {
    var d = new Date();
    if (d.getDate() <= parseInt(localStorage.getItem("cs_claim_cutoff_date")) || rejected ) 
      d.setMonth(d.getMonth()-1);
    d.setDate(1);
    d.toISOString();
    return d.toISOString().substr(0,10);
  }


  export function maxDate() {
    var d = new Date();
    return d.toISOString().substr(0,10);
  }
