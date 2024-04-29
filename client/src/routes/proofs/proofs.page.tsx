import AnyTimerList from "../../components/anytimerlist.component";
import "./proofs.page.css"

export default function Proofs() {
    return(
        <div className="proofs-page">
            <h1 className="completed-proofs">COMPLETED PROOFS</h1>
            <AnyTimerList direction='incoming' list_type="confirmed" state="completed"/>
            <h1 className="used-anytimers">USED ANYTIMERS</h1>
            <AnyTimerList direction='outgoing' list_type="confirmed" state="used"/>
        </div>
    )
}