import { useNavigate } from "react-router-dom";
import AnyTimerList from "../../components/anytimerlist.component";
import './requests.page.css';
import User from "../../modules/user.module";
import { useEffect } from "react";

export default function Requests() {
    const navigate = useNavigate();

    useEffect(() => {
        if(!User.getIsLoggedIn) {
            console.log("test")
            navigate("/")
        }
    }, [])

    if(User.getIsLoggedIn) {
        return(
            <div className="requests-page">
                <h1 className="incoming-requests">INCOMING REQUESTS</h1>
                <AnyTimerList direction='incoming' list_type="request" state ="unused"/>
                <h1 className="outgoing-requests">OUTGOING REQUESTS</h1>
                <AnyTimerList direction='outgoing' list_type="request" state ="unused"/>
            </div>
        )
    }
}