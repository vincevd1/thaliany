import AnyTimerList from "../../components/anytimerlist.component";
import './requests.page.css';

export default function Requests() {
    return(
        <div className="requests-page">
            <h1>Incoming requests</h1>
            <AnyTimerList direction='incoming' list_type="request" />
            <h1>Outgoing requests</h1>
            <AnyTimerList direction='outgoing' list_type="request" />
        </div>
    )
}