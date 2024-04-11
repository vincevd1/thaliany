import axios from "axios";
import Credentials from "../models/credentials.model";
import User from "../modules/user.module";
import APIBase from "../enums/apibase.enum";

class _APIService {
    backend_uri: string;
    concrexit_uri: string;
    auth_path: string;
    token_path: string;
    client_id: string;
    redirect_uri: string;
    code_challenge: string;

    constructor(
        backend_uri: string,
        concrexit_uri: string,
        auth_path: string,
        token_path: string,
        client_id: string,
        redirect_uri: string,
        code_challenge: string | null
    ) {
        this.backend_uri = backend_uri;
        this.concrexit_uri = concrexit_uri;
        this.auth_path = auth_path;
        this.token_path = token_path;
        this.client_id = client_id;
        this.redirect_uri = redirect_uri;
        this.code_challenge = code_challenge || "";
    }

    generateAuthLink(): string {
        const authLink = new URL(this.concrexit_uri);
        authLink.pathname = this.auth_path;

        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const values = new Uint32Array(48);
        window.crypto.getRandomValues(values);
        
        this.code_challenge = '';
        for (let i = 0; i < 48; i++) {
            this.code_challenge += charset[values[i] % charset.length];
        }
        localStorage.setItem('code_challenge', this.code_challenge)

        authLink.searchParams.append('client_id', this.client_id);
        authLink.searchParams.append('scope', 'profile:read members:read');
        authLink.searchParams.append('redirect_uri', this.redirect_uri);
        authLink.searchParams.append('response_type', 'code');
        authLink.searchParams.append('code_challenge', this.code_challenge)
        authLink.searchParams.append('code_challenge_method', 'plain')

        return authLink.toString();
    }

    async getCredentialsFromCode(code: string): Promise<Credentials> {
        const form: FormData = new FormData();
        form.append('grant_type', 'authorization_code')
        form.append('client_id', this.client_id)
        form.append('code', code)
        form.append('code_verifier', this.code_challenge)
        form.append('redirect_uri', this.redirect_uri)

        const req = await axios.postForm<Credentials>(`${this.concrexit_uri}${this.token_path}`, form)

        return req.data
    }

    async getAccessTokenFromRefreshToken(refresh_token: string): Promise<Credentials> {
        const form: FormData = new FormData();
        form.append('grant_type', 'refresh_token')
        form.append('client_id', this.client_id)
        form.append('refresh_token', refresh_token)

        const req = await axios.postForm<Credentials>(`${this.concrexit_uri}${this.token_path}`, form)
        return req.data;
    }

    async get<T>(base: APIBase, path: string): Promise<T> {
        console.info("GET")
        const base_uri = base == APIBase.CONCREXIT ? this.concrexit_uri : this.backend_uri;

        try {
            const req = await axios.get(`${base_uri}${path}`, {
                headers: {
                    'Authorization': `Bearer ${User.getAccessToken}`
                }
            })

            return req.data
        } catch(error: any) {
            // window.location.href = '/api/error';
            // window.location.reload();
            throw new Error(error);
        }
    }

    async post<T>(base: APIBase, path: string, data: any): Promise<T> {
        console.info("POST")
        const base_uri = base == APIBase.CONCREXIT ? this.concrexit_uri : this.backend_uri;

        try {
            const req = await axios.post(`${base_uri}${path}`, data, {
                headers: {
                    'Authorization': `Bearer ${User.getAccessToken}`
                }
            })
    
            return req.data
        } catch(error: any) {
            // window.location.href = '/api/error';
            // window.location.reload();
            throw new Error(error)
        }
    }
}

const APIService = new _APIService(
    import.meta.env.VITE_BACKEND_URI,
    import.meta.env.VITE_CONCREXIT_URI,
    import.meta.env.VITE_AUTH_PATH,
    import.meta.env.VITE_TOKEN_PATH,
    import.meta.env.VITE_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_URI,
    localStorage.getItem('code_challenge')
)

export default APIService