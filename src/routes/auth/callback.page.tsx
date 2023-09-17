import { useEffect } from 'react';
import Credentials from '../../models/credentials.model';
import User from '../../modules/user.module';
import APIService from '../../services/api.service'

export default function AuthCallback() {
    const url = new URL(window.location.href);
    const params = url.searchParams

    if(params.get('error')) {
        return(
            <div>An error has occured while trying to authenticate, please try again.</div>
        )
    } else if(params.get('code') && !User.getIsLoggedIn) {

        useEffect(() => {
            async function Authenticate() {
                const credentials: Credentials = await APIService.getCredentialsFromCode(params.get('code') as string)
        
                User.setAccessToken = credentials.access_token;
                User.setRefreshToken = credentials.refresh_token;
                User.setExpiration = Date.now() + credentials.expires_in * 1000;
    
                localStorage.removeItem('code_challenge');
                window.location.href = '/'
            }

            Authenticate();
        })

        return(
            <div>Authenticating... please wait</div>
        )
    } else {
        window.location.href = '/'
    }
}