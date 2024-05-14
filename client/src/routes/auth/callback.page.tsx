import { useEffect } from 'react';
import Credentials from '../../models/credentials.model';
import User from '../../modules/user.module';
import { APIService } from '../../services/api.service'
import Loading from '../../components/loading.component';
import "./callback.page.css"

export default function AuthCallback() {
    const url = new URL(window.location.href);
    const params = url.searchParams

    if(params.get('error')) {
        return(
            <div>An error has occured while trying to authenticate, please try again.</div>
        )
    } else if(params.get('code') && !User.getIsLoggedIn) {
        useEffect(() => {
            APIService.getCredentialsFromCode(params.get('code')!).then((credentials: Credentials) => {
                User.setAccessToken = credentials.access_token;
                User.setIdToken = credentials.id_token;
                User.setRefreshToken = credentials.refresh_token;
                User.setExpiration = Date.now() + credentials.expires_in * 1000;
    
                localStorage.removeItem('code_challenge');
                window.location.href = '/'
            })
        })

        return(
            <>
                <h2 className="auth-header">Authenticating, please wait</h2>
                <Loading />
            </>
        )
    } else {
        window.location.href = '/'
    }
}