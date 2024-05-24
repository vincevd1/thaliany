import { useEffect, useState } from "react";
import { ThaliaUser } from "../models/thalia.user.model";
import User from "../modules/user.module";
import { APIService, APIBase } from "../services/api.service";
import './overview.page.css'
import AnyTimerList from "../components/anytimerlist.component";
import Loading from "../components/loading.component";
import { useNotification } from "../components/notification.component";

import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Overview() {
    const [avatar, setAvatar] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const notifications = useNotification();

    useEffect(() => {   
        function fetchUser() {
            APIService.get<ThaliaUser>(APIBase.CONCREXIT, '/api/v2/members/me')
                .then(thaliaUser => {
                    setAvatar(thaliaUser.profile.photo.large);
                    setDisplayName(thaliaUser.profile.display_name);
        
                    setIsLoading(false);
                })
                .catch(() => {
                    notifications.notify("Something went wrong while trying to retrieve user!")
                })
        }

        if (User.getIsLoggedIn) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, [])

    if(isLoading) {
        return(
            <Loading />
        )
    }

    if (User.getIsLoggedIn) {
        return (
            <>
                <div className="welcome-wrapper">
                    <img className="profile-photo" src={avatar} alt="" />
                    <h1 className="welcome-header">HELLO {displayName.toUpperCase()}</h1>
                </div>

                <h2 className="overview-header">OVERVIEW</h2>
                <h2>INCOMING ANYTIMERS</h2>
                <AnyTimerList list_type='confirmed' direction='incoming' state="used"/>
                <h2>YOUR ANYTIMERS</h2>
                <AnyTimerList list_type='confirmed' direction='outgoing' state="unused"/>
                <h2>ANYTIMERS ON YOU</h2>
                <AnyTimerList list_type='confirmed' direction='incoming' state="unused"/>

                <footer>
                    <a className="icon-link" href="https://github.com/vincevd1/thaliany">
                        <FaGithub size={"1.25em"}/>
                    </a>

                    <a className="icon-link" href="mailto:thaliany@thalia.nu">
                        <MdEmail size={"1.5em"}/>
                    </a>

                    <a href="/privacy-policy">
                        Privacy Policy
                    </a>
                </footer>
            </>
        )
    } else {
        return (
            <div className="not-logged-in">
                <h1>THALIANY</h1>
                <p>Not logged in! Please login first.</p>
                <button onClick={() => User.login()}>Login with 
                <svg width="20px" height="20px" viewBox="0 0 374 375" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><title data-v-76e31e7a="">logo-t</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" data-v-76e31e7a=""><g id="logo-t" transform="translate(-1.000000, 0.000000)" fillRule="nonzero" fill="#ffffff" data-v-76e31e7a=""><path d="M196.929558,309.422964 C193.450765,306.717236 261.190596,373.104203 262.253561,373.973901 L196.929558,373.973901 C196.929558,373.973901 196.929558,309.422964 196.929558,309.422964 L196.929558,309.422964 Z" id="hoekje_onder_3_" data-v-76e31e7a=""></path><path d="M95.2714947,278.307093 L192.291167,181.28742 C192.291167,181.28742 192.194534,374.843599 192.097901,374.940233 L95.2714947,278.307093 Z" id="Driehoek_onder_3_" data-v-76e31e7a=""></path><path d="M140.012639,33.1488165 C172.38474,65.5209184 237.032311,130.458388 237.032311,130.458388 C237.032311,130.458388 139.916005,227.188162 140.012639,227.284795 L140.012639,33.1488165 Z" id="maindriehoek_3_" data-v-76e31e7a=""></path><polygon id="driehoekbovenmid_3_" points="140.495804 27.5440943 276.748532 27.5440943 208.622168 95.2839255" data-v-76e31e7a=""></polygon><path d="M70.4367777,27.5440943 L135.470881,27.5440943 L135.470881,91.6118662 C135.470881,91.6118662 70.7266771,91.6118662 70.4367777,91.6118662 L70.4367777,27.5440943 Z" id="blokje_3_"></path><path d="M65.8950201,91.7084993 C65.8950201,91.7084993 0.8609169,27.5440943 0.95755004,27.5440943 L65.8950201,27.6407275" id="hoekjelinksboven_3_"></path><polygon id="raarding_3_" points="310.086965 0.48681514 374.154737 0.48681514 307.381237 67.2603149 243.313465 67.2603149"></polygon></g></g></svg>
                </button>
            </div>
        )
    }
}