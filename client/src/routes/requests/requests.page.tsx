import AnyTimerList from "../../components/anytimerlist.component";
import './requests.page.css';

export default function Requests() {
    return(
        <div className="requests-page">
            <h1 className="incoming-requests">Incoming requests</h1>
            <AnyTimerList direction='incoming' list_type="request" />
            <h1 className="outgoing-requests">Outgoing requests</h1>
            <AnyTimerList direction='outgoing' list_type="request" />
        </div>
    )
}