import { DREAMFACTORY_API_KEY, DREAMFACTORY_TABLE_URL } from "../app/config/constants";

import { Http } from "@angular/http";
import { LoginPage } from "../pages/login/login";
import { NavController } from "ionic-angular";

export class authCheck {
    public AdminLogin: boolean = false;
    public Add_Form: boolean = false;
    public Edit_Form: boolean = false;
    public button_Add_Disable = true;
    public button_Edit_Disable = true;
    public button_Delete_Disable = true;
    public button_View_Disable = true;
    public http: Http;
    tenants: any;
    Key_Param: string = 'api_key=' + DREAMFACTORY_API_KEY;

    constructor(
        public navCtrl: NavController,
        public adminDelegation: boolean = false
    ) {
        if (!localStorage.getItem("g_USER_GUID")) {
            alert("Sorry. You are not logged in. Please login.");
            this.navCtrl.push(LoginPage);
        }
        if (adminDelegation) {
            this.assignDelegatedRights();
        }
    }

    assignDelegatedRights() {
        //Get the role for this page------------------------------        
        if (localStorage.getItem("g_KEY_ADD") == "1") { this.button_Add_Disable = false; }
        if (localStorage.getItem("g_KEY_EDIT") == "1") { this.button_Edit_Disable = false; }
        if (localStorage.getItem("g_KEY_DELETE") == "1") { this.button_Delete_Disable = false; }
        if (localStorage.getItem("g_KEY_VIEW") == "1") { this.button_View_Disable = false; }

        //Clear localStorage value--------------------------------      
        this.ClearLocalStorage();

        //fill all the tenant details----------------------------      
        this.FillTenant();
        if (this.button_View_Disable) {
            alert('Sorry, you are not authorized for the action.');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
    }

    ClearLocalStorage() {
        if (localStorage.getItem('Prev_Name') == null) {
            localStorage.setItem('Prev_Name', null);
        }
        else {
            localStorage.removeItem("Prev_Name");
        }
        if (localStorage.getItem('Prev_TenantGuid') == null) {
            localStorage.setItem('Prev_TenantGuid', null);
        }
        else {
            localStorage.removeItem("Prev_TenantGuid");
        }
    }

    FillTenant() {
        if (localStorage.getItem("g_IS_SUPER") == "1") {
            let tenantUrl: string = DREAMFACTORY_TABLE_URL + 'tenant_main?order=TENANT_ACCOUNT_NAME&' + this.Key_Param;
            this.http
                .get(tenantUrl)
                .map(res => res.json())
                .subscribe(data => {
                    this.tenants = data.resource;
                });
            this.AdminLogin = true;
        }
        else {
            this.AdminLogin = false;
        }
    }
}