import { APIService } from "../services/api.service";

class _User {
    private isLoggedIn: boolean | null;
    private access_token: string | null;
    private refresh_token: string | null;
    private expires: number | null;

    constructor(
        access_token: string | null,
        refresh_token: string | null,
        expires: string | null
    ) {
        this.isLoggedIn = false;
        this.access_token = access_token;
        this.refresh_token = refresh_token;

        if(expires) {
            this.expires = parseInt(expires);
        } else {
            this.expires = null;
        } 

        if(this.access_token && this.refresh_token && this.expires) {
            this.checkExpiration()
        }

        console.log('User initialized')
    }

    loginWithRefreshToken(): void {
        /** Login using a refresh token
         *  Make sure you know this.refresh_token exists first!
         */

        APIService.getAccessTokenFromRefreshToken(this.refresh_token!).then(credentials => {
            this.setAccessToken = credentials.access_token;
            this.setRefreshToken = credentials.refresh_token;
            this.setExpiration = Date.now() + credentials.expires_in * 1000;

            this.isLoggedIn = true;
            window.location.reload();
        }).catch(() => {
            // Default to standard login if something goes wrong.

            localStorage.removeItem('refresh_token');
            this.refresh_token = null
            this.login();
        })
    }

    checkExpiration(): void {
        if(this.expires && this.refresh_token) {
            if(Date.now() > this.expires - 6000) {
                this.loginWithRefreshToken();
            } else {
                this.isLoggedIn = true;
            }
        }
    }

    login(): void {
        if(this.refresh_token) {
            this.loginWithRefreshToken();
        } else {
            const authLink = APIService.generateAuthLink();
            window.location.href = authLink;
        }
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires')

        window.location.href = '/';
    }

    get getIsLoggedIn() {
        return this.isLoggedIn;
    }

    get getAccessToken() {
        return this.access_token
    }

    get getRefreshToken() {
        return this.refresh_token
    }

    get getExpiration() {
        return this.expires;
    }

    set setAccessToken(access_token: string) {
        localStorage.setItem('access_token', access_token)
        this.access_token = access_token;
    }

    set setRefreshToken(refresh_token: string) {
        localStorage.setItem('refresh_token', refresh_token)
        this.refresh_token = refresh_token;
    }

    set setIdToken(id_token: string) {
        document.cookie = `token=${id_token};path=/;samesite=lax;max-age=31536000;secure`
    }

    set setExpiration(expires: number) {
        localStorage.setItem('expires', expires.toString())
        this.expires = expires
    }
}

const User = new _User(
    localStorage.getItem('access_token'), 
    localStorage.getItem('refresh_token'), 
    localStorage.getItem('expires')
);

export default User;