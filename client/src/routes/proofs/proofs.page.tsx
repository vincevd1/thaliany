import { useNavigate } from "react-router-dom";
import AnyTimerList from "../../components/anytimerlist.component";
import "./proofs.page.css"
import User from "../../modules/user.module";
import { useEffect } from "react";

export default function Proofs() {
    const navigate = useNavigate();

    useEffect(() => {
        if(!User.getIsLoggedIn) {
            navigate("/")
        }
    }, [])

    if(User.getIsLoggedIn) {
        return(
            <div className="proofs-page">
                <h1 className="your-proofs">YOUR PROOFS</h1>
                <AnyTimerList direction='incoming' list_type="confirmed" state="completed"/>
                <h1 className="proofs-from-others">PROOFS FROM OTHERS</h1>
                <AnyTimerList direction='outgoing' list_type="confirmed" state="completed"/>
                <h1 className="used-anytimers">USED ANYTIMERS</h1>
                <AnyTimerList direction='outgoing' list_type="confirmed" state="used"/>
            </div>
        )
    }
}