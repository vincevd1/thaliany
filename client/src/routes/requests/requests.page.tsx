import AnyTimerList from "../../components/anytimerlist.component";
import './requests.page.css';

export default function Requests() {
    return(
        <div className="requests-page">
            <h1 className="incoming-requests">INCOMING REQUESTS</h1>
            <AnyTimerList direction='incoming' list_type="request" state ="unused"/>
            <h1 className="outgoing-requests">OUTGOING REQUESTS</h1>
            <AnyTimerList direction='outgoing' list_type="request" state ="unused"/>
        </div>
    )
}