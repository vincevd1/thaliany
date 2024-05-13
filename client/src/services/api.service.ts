import axios from "axios";
import Credentials from "../models/credentials.model";
import User from "../modules/user.module";

enum APIBase {
    CONCREXIT,
    BACKEND
}

class _APIService {
    backend_uri: string;
    concrexit_uri: string;
    auth_path: string;
    token_path: string;
    client_id: string;
    redirect_uri: string;

    constructor(
        backend_uri: string,
        concrexit_uri: string,
        auth_path: string,
        token_path: string,
        client_id: string,
        redirect_uri: string,
    ) {
        this.backend_uri = backend_uri;
        this.concrexit_uri = concrexit_uri;
        this.auth_path = auth_path;
        this.token_path = token_path;
        this.client_id = client_id;
        this.redirect_uri = redirect_uri;
    }

    generateAuthLink(): string {
        const authLink = new URL(this.concrexit_uri);
        authLink.pathname = this.auth_path;

        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const values = new Uint32Array(48);
        window.crypto.getRandomValues(values);
        
        let code_challenge = '';
        for (let i = 0; i < 48; i++) {
            code_challenge += charset[values[i] % charset.length];
        }
        localStorage.setItem('code_challenge', code_challenge)

        authLink.searchParams.append('client_id', this.client_id);
        authLink.searchParams.append('scope', 'openid profile:read members:read');
        authLink.searchParams.append('redirect_uri', this.redirect_uri);
        authLink.searchParams.append('response_type', 'code');
        authLink.searchParams.append('code_challenge', code_challenge)
        authLink.searchParams.append('code_challenge_method', 'plain')

        return authLink.toString();
    }

    getCredentialsFromCode(code: string): Promise<Credentials> {
        return new Promise((resolve, reject) => {
            const form: FormData = new FormData();
            const code_challenge = localStorage.getItem('code_challenge');

            if(code_challenge) {
                form.append('grant_type', 'authorization_code')
                form.append('client_id', this.client_id)
                form.append('code', code)
                form.append('code_verifier', code_challenge)
                form.append('redirect_uri', this.redirect_uri)
        
                axios.postForm<Credentials>(`${this.concrexit_uri}${this.token_path}`, form)
                    .then(res => {
                        localStorage.removeItem('code_challenge')
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            } else {
                reject("Code challenge not found in local storage!")
            }
        })
    }

    getAccessTokenFromRefreshToken(refresh_token: string): Promise<Credentials> {
        return new Promise((resolve, reject) => {
            const form: FormData = new FormData();
            form.append('grant_type', 'refresh_token')
            form.append('client_id', this.client_id)
            form.append('refresh_token', refresh_token)
    
            axios.postForm<Credentials>(`${this.concrexit_uri}${this.token_path}`, form)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    get<T>(base: APIBase, path: string): Promise<T> {
        return new Promise((resolve, reject) => {
            // console.info("GET")
            const base_uri = base == APIBase.CONCREXIT ? this.concrexit_uri : this.backend_uri;
    
            axios.get(`${base_uri}${path}`, {
                headers: {
                    'Authorization': `Bearer ${User.getAccessToken}`
                }
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err)
            })
        })
    }

    post<T>(base: APIBase, path: string, data?: any): Promise<T> {
        return new Promise((resolve, reject) => {
            // console.info("POST")
            const base_uri = base == APIBase.CONCREXIT ? this.concrexit_uri : this.backend_uri;

            axios.post(`${base_uri}${path}`, data, {
                headers: {
                    'Authorization': `Bearer ${User.getAccessToken}`
                }
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err);
            })
        })
    }
}

const APIService = new _APIService(
    import.meta.env.VITE_BACKEND_URI,
    import.meta.env.VITE_CONCREXIT_URI,
    import.meta.env.VITE_AUTH_PATH,
    import.meta.env.VITE_TOKEN_PATH,
    import.meta.env.VITE_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_URI,
)

export {
    APIService,
    APIBase
}