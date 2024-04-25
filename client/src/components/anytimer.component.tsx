import APIService from "../services/api.service";
import Popup from './popup.component'
import APIBase from "../enums/apibase.enum";
import './anytimer.component.css'
import AnyTimer from "../models/anytimer.model";
import {FormEvent, useState } from 'react';

interface Props {
    AnyTimer: AnyTimer,
    direction: 'outgoing' | 'incoming'
    type: 'confirmed' | 'request'
    state: string
}

//todo change type to anytimer model
export default function AnyTimerComponent({ AnyTimer, direction, type , state }: Props) {
    const displayName = (direction == 'outgoing') ? AnyTimer.recipient_name : AnyTimer.owner_name;

    // State of the anytimer, when the user clicks a button the anytimer should disappear
    const [showAnytimer, setShowAnytimer] = useState(true);
    const [, setAmount] = useState({ AnyTimer });

    function postAcceptAny() {
        APIService.post(
            APIBase.BACKEND,
            `/api/anytimers/requests/${AnyTimer.id}/accept/`
        ).then(() => {
            setShowAnytimer(false)
        });
    }

    function postDenyAny() {
        APIService.post(
            APIBase.BACKEND,
            `/api/anytimers/requests/${AnyTimer.id}/deny/`
        ).then(() => {
            setShowAnytimer(false)
        });
    }

    function postRevokeAny() {
        APIService.post(
            APIBase.BACKEND,
            `/api/anytimers/requests/${AnyTimer.id}/revoke/`
        ).then(() => {
            setShowAnytimer(false)
        });
    }

    function postUseAny() {
        APIService.post(
            APIBase.BACKEND,
            `/api/anytimers/confirmed/${AnyTimer.id}/use/`
        ).then(() => {
            if (AnyTimer.amount == 1) {
                setShowAnytimer(false)
            } else {
                AnyTimer.amount -= 1;
                setAmount({ AnyTimer });
            }
        });
    }

    function giveOrRequestAnyForm() {
        return(
            <>
                <div className="form-content">
                    <span>Upload photo</span>
                    {/* todo add photo upload */}

                </div>
                <div className="button-wrapper">
                    <button className="confirm-button confirmation-button" type='submit' >
                        Confirm
                    </button>
                </div>
            </>
        )
    }

    function postGiveAny(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        
        const data = {
            // get photo
        }

        APIService.post(
            APIBase.BACKEND, 
            `/api/anytimers/confirmed/${AnyTimer.id}/complete/`, 
            data
        ).then(() => {
            //close popup
        });
    }



    if(showAnytimer) {
        return (
            <div className="anytimer">
                <div className="anytimer-info">
                    <span>{displayName}</span>
                    <span>Amount: {AnyTimer.amount}</span>
                    <span>Type: {AnyTimer.type}</span>
                    {/* <span>Description: {AnyTimer.description}</span> */}
                </div>
                <div className="anytimer-buttons">
                    {
                        type == 'confirmed' && direction == 'outgoing' ? (
                            <button className="anytimer-button" onClick={postUseAny}>
                                USE
                            </button>
                        ) : null
                    }
                    {
                        type == 'confirmed' && direction == 'incoming' && state == "used"? (
                            <Popup title={"Complete anytimer from " + AnyTimer.owner_name} button={
                                <button className="complete-button">
                                    COMPLETE
                                </button>
                            }>
                                <form onSubmit={postGiveAny}>
                                    {giveOrRequestAnyForm()}
                                </form>
                            </Popup>
                        ) : null
                    }
                    {
                        type == 'request' && direction == 'incoming' ? (
                            <>
                                <button id="accept" className="anytimer-button" onClick={postAcceptAny}>
                                    ACCEPT
                                </button>
                                <button id="decline" className="anytimer-button" onClick={postDenyAny}>
                                    DECLINE
                                </button>
                            </>
                        ) : null
                    }
                    {
                        type == 'request' && direction == 'outgoing' ? (
                            <button className="anytimer-button" onClick={postRevokeAny}>
                                REVOKE
                            </button>
                        ) : null
                    }
                </div>
            </div>
        )
    }
}