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
    const [amount, setAmount] = useState(AnyTimer.amount);
    const [file, setFile] = useState<string | undefined>();
    
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) {
            return;
        }
        const selectedFile = event.target.files[0];

        setFile(URL.createObjectURL(selectedFile));
    }

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
            if (amount == 1) {
                setShowAnytimer(false)
            } else {
                setAmount(amount - 1);
            }
        });
    }

    function uploadProofForm() {
        return(
            <>
                <div className="form-content">
                    <span>Upload photo</span>
                    <input type="file" accept=".png,.jpg,.jpeg,.gif" name="photo" id="photo" onChange={handleChange} />
                    <img src={file} className="picture" />
                </div>
                <div className="button-wrapper">
                    <button className="confirm-button confirmation-button" type='submit' >
                        Confirm
                    </button>
                </div>
            </>
        )
    }

    function postCompleteAny(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // THIS TOOK ME 3 HOURS TO FIGURE OUT AND IT DOES NOT EVEN LOOK THAT COMPLICATED
        // BUT ALSO THE DJANGO API ENDPOINT IS WORKING NOW BUT I DONT KNOW HOW
        // FOR CONTEXT THIS IS RIGHT AFTER THE KINGSDAY BORREL
        const formData = new FormData();
        if (file) {
            fetch(file)
            .then(response => response.blob())
            .then(blob => {
                formData.append('proof_type', "photo") //default for now
                formData.append('photo',blob, AnyTimer.id+'.jpg');
                APIService.post(
                    APIBase.BACKEND, 
                    `/api/anytimers/confirmed/${AnyTimer.id}/complete/`, 
                    formData
                ).then(() => {
                    setShowAnytimer(false)
                });
            });
        }
    }

    if(showAnytimer) {
        return (
            <div className="anytimer">
                <div className="anytimer-info">
                    <span>{displayName}</span>
                    <span>Amount: {amount}</span>
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
                                <form onSubmit={postCompleteAny}>
                                    {uploadProofForm()}
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