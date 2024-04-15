import { useEffect, useState } from "react";
import { ThaliaUser } from "../models/thalia.user.model";
import User from "../modules/user.module";
import APIService from "../services/api.service";
import APIBase from "../enums/apibase.enum";
import './overview.css'
import AnyTimerList from "../components/anytimerlist.component";

export default function Overview() {
    const [avatar, setAvatar] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {   
        async function fetchUser() {
            const thaliaUser: ThaliaUser = await APIService.get<ThaliaUser>(APIBase.CONCREXIT, '/api/v2/members/me')

            const apiTest: any = await APIService.get<any>(APIBase.BACKEND, '/api/hello_world/')
            console.log(apiTest);

            setAvatar(thaliaUser.profile.photo.large);
            setDisplayName(thaliaUser.profile.display_name);

            setIsLoading(false);
        }

        if (User.getIsLoggedIn) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, [])

    if(isLoading) {
        return(
            <div>Loading.. please wait</div>
        )
    }

    if (User.getIsLoggedIn) {
        return (
            <>
                <div className="welcome-wrapper">
                    <img className="profile-photo" src={avatar} alt="" />
                    <h1 className="welcome-header">Hello {displayName}</h1>
                </div>

                <h2 className="overview-header">Overview</h2>

                <h2>Your anytimers</h2>
                <AnyTimerList list_type='confirmed' direction='outgoing' />
                <h2>Incoming anytimers</h2>
                <AnyTimerList list_type='confirmed' direction='incoming' />
            </>
        )
    } else {
        return (
            <>
                <div>Not logged in!</div>
                <button onClick={User.login}>Login!</button>
            </>
        )
    }
}