import "./loading.component.css"
import loadingImg from "../images/loading.png"

export default function Loading() {
    return(
        <div className="loading">
            <img src={loadingImg} alt="loading" className="loading-image"/>
        </div>
    )
}