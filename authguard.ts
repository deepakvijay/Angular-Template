
/*-------------------------------------------------------------------------------------

(C) 2013-2018 Johnson Controls International Plc.
 *     All rights reserved. This software constitutes the trade secrets and confidential
 *     and proprietary information of Johnson Controls International Plc. It is intended
 *     solely for use by Johnson Controls International Plc. This code may not be copied
 *     or redistributed to third parties without prior written authorization from
 *     Johnson Controls International Plc.

-------------------------------------------------------------------------------------*/
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiEndpoints, Constants, HttpStatusCode } from "../constant/index";
import "rxjs/add/operator/map";

@Injectable()
export class AuthenticationService {
    token: string;

    constructor(private http: HttpClient) { }

    async loginAsync(username: string, password: string, culture: string): Promise<any> {
        try {
            const response = await this.http.post(ApiEndpoints.authentication.Authenticate,
                JSON.stringify({ username: username, password: password, culture: culture })).toPromise();
            return response;
        } catch (error) {
            await this.handleError(error);
        }
        return null;
    }

    logout(username: string): void {
        // clear token remove user from local storage to log user out
        this.http.post(ApiEndpoints.authentication.Logout,
            JSON.stringify({ username: username })).toPromise()
            .then(
            (): void => { // Success
                this.token = null;
                localStorage.removeItem(Constants.authUser);
            })
            .catch(this.handleError);
    }

    getToken(): string {
        let token = "";
        const user = localStorage.getItem(Constants.authUser);
        if (user && JSON.parse(user).StatusCode === HttpStatusCode.Ok) {
            token = JSON.parse(user).Result.AccessToken;
        }
        return token;
    }

    getAuthUserDetails(): any {
        let userDtls = "";
        const user = localStorage.getItem(Constants.authUser);
        if (user) {
            userDtls = JSON.parse(user).Result;
        }
        return userDtls;
    }

    setToken(newToken: String): void {
        const user = localStorage.getItem(Constants.authUser);
        if (user) {
            localStorage.setItem(Constants.authUser, JSON.stringify(JSON.parse(user).Result.AccessToken = newToken));
        }
    }

    private handleError(error: any): Promise<any> {
        console.log(Constants.errorOccurred, error);
        return Promise.reject(error.message || error);
    }
}
