import { APIService, APIBase } from "../services/api.service";
import Popup from './popup.component'
import './anytimer.component.css'
import AnyTimer from "../models/anytimer.model";
import {FormEvent, useEffect, useState } from 'react';
import AnyTimerProof from "../models/anytimerproof.model";
import { useNotification } from "./notification.component";

type Props = {
    AnyTimer: AnyTimer,
    direction: 'outgoing' | 'incoming',
    type: 'confirmed' | 'request',
    state: 'used' | 'unused' | 'completed'
}

export default function AnyTimerComponent({ AnyTimer, direction, type , state }: Props) {
    const displayName = (direction == 'outgoing') ? AnyTimer.recipient_name : AnyTimer.owner_name;

    // State of the anytimer, when the user clicks a button the anytimer should disappear
    const [showAnytimer, setShowAnytimer] = useState(true);
    const [amount, setAmount] = useState(AnyTimer.amount);
    const [file, setFile] = useState<string>();
    const [fileType, setFileType] = useState<string>();
    const [proof, setProof] = useState<AnyTimerProof>();
    const notifications = useNotification()

    useEffect(() => {
        if(state == "completed") {
            APIService.get<AnyTimerProof>(APIBase.BACKEND, `/api/proofs/${AnyTimer.id}`)
            .then(res => {
                setProof(res);
            })
            .catch(() => {
                notifications.notify("Something went wrong while trying to retrieve proofs")
            });
        }
    },[])
    
    function postAcceptAny() {
        APIService.post(
            APIBase.BACKEND,
            `/api/anytimers/requests/${AnyTimer.id}/accept/`
        ).then(() => {
            setShowAnytimer(false)
            notifications.notify(`Successfully accepted request from ${ AnyTimer.owner_name }`);
        })
        .catch(() => {
            notifications.notify("Something went wrong while trying to accept anytimer")
        });
    }

    function postDenyAny() {
        APIService.post(
            APIBase.BACKEND,
            `/api/anytimers/requests/${AnyTimer.id}/deny/`
        ).then(() => {
            setShowAnytimer(false)
            notifications.notify(`Successfully denied request from ${ AnyTimer.owner_name }`);
        })
        .catch(() => {
            notifications.notify("Something went wrong while trying to deny anytimer")
        });
    }

    function postRevokeAny() {
        APIService.post(
            APIBase.BACKEND,
            `/api/anytimers/requests/${AnyTimer.id}/revoke/`
        ).then(() => {
            setShowAnytimer(false)
            notifications.notify(`Successfully revoked outgoing request to ${ AnyTimer.recipient_name }`);
        })
        .catch(() => {
            notifications.notify("Something went wrong while trying to revoke anytimer")
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

            notifications.notify("Successfully used anytimer!");
        })
        .catch(() => {
            notifications.notify("Something went wrong while trying to use anytimer")
        });
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
                const extension = blob.type.split("/")[1];
                const proof_type = blob.type.split("/")[0];

                formData.append('proof_type', proof_type)
                formData.append('file', blob, `${AnyTimer.id}.${extension}`);

                APIService.post(
                    APIBase.BACKEND, 
                    `/api/anytimers/confirmed/${AnyTimer.id}/complete/`, 
                    formData
                ).then(() => {
                    notifications.notify("Successfully completed anytimer!");
                    setShowAnytimer(false)
                })
                .catch(() => {
                    notifications.notify("Something went wrong while trying to complete anytimer")
                });
            });
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) {
            return;
        }
        const selectedFile = event.target.files[0];

        setFile(URL.createObjectURL(selectedFile));
        setFileType(selectedFile.type.split("/")[0]);
    }

    if(showAnytimer) {
        return (
            <div className="anytimer">
                <div className="anytimer-info">
                    <span>{displayName}</span>
                    <span>Amount: {amount}</span>
                    <span>Type: {AnyTimer.type}</span>
                </div>
                <div className="anytimer-buttons">
                    <Popup title={ (direction == 'outgoing') ? `ANYTIMER ON ${ AnyTimer.recipient_name.toUpperCase() }` : `ANYTIMER FROM ${ AnyTimer.owner_name.toUpperCase() }` } button={
                        <button className="anytimer-button">
                            VIEW
                        </button>
                    }>
                        <>
                            <div className="detailed-anytimer-info">
                                <span>Anytimer Nr: {AnyTimer.id} </span>
                                <span>Owner: {AnyTimer.owner_name}</span>
                                <span>Recipient: {AnyTimer.recipient_name}</span>
                                <span>Amount: {amount}</span>
                                <span>Type: {AnyTimer.type}</span>
                                { AnyTimer.description != '' && <span>Description: {AnyTimer.description}</span> }
                            </div>

                            {
                                state == "completed" && proof && (
                                    <>
                                        <h2>ANYTIMER PROOF</h2>
                                        <span>Completed at { new Date(proof.created_at).toUTCString() }</span>
                                        {
                                            (proof.proof_type == "image") && <img src={proof.proof_file} className="picture" />
                                        }
                                        {
                                            (proof.proof_type == "video") && 
                                            <video width="480" height="270" controls className="picture"><source src={proof.proof_file} type="video/mp4" /></video>
                                        }
                                    </>
                                )
                            }
                        </>
                    </Popup>

                    {
                        type == 'confirmed' && direction == 'outgoing' && state == "unused" && (
                            <button className="anytimer-button" onClick={postUseAny}>
                                USE
                            </button>
                        ) 
                    }
                    {
                        type == 'confirmed' && direction == 'incoming' && state == "used" && (
                            <Popup title={"Complete anytimer from " + AnyTimer.owner_name} button={
                                <button className="complete-button">
                                    COMPLETE
                                </button>
                            }>
                                {
                                    close => (
                                        <form onSubmit={
                                            e => {
                                                postCompleteAny(e);
                                                close()
                                            }
                                        }>
                                            <div className="form-content">
                                                <span>Upload photo</span>
                                                <input type="file" accept=".png,.jpg,.jpeg,.gif,.mp4,.mov,.avi" name="photo" id="photo" onChange={handleChange} />
                                                {
                                                    (fileType == 'image') && <img src={file} className="picture" />
                                                }
                                                {
                                                    (fileType == 'video') &&
                                                    <video width="480" height="270" controls className="picture"><source src={file} type="video/mp4" /></video>
                                                }
                                            </div>
                                            <div className="button-wrapper">
                                                <button className="confirm-button confirmation-button" type='submit'>
                                                    CONFIRM
                                                </button>
                                            </div>
                                        </form>
                                    )
                                }
                            </Popup>
                        )
                    }
                    {
                        type == 'request' && direction == 'incoming' && (
                            <>
                                <button id="accept" className="anytimer-button" onClick={postAcceptAny}>
                                    ACCEPT
                                </button>
                                <button id="decline" className="anytimer-button" onClick={postDenyAny}>
                                    DECLINE
                                </button>
                            </>
                        )
                    }
                    {
                        type == 'request' && direction == 'outgoing' && (
                            <button className="anytimer-button" onClick={postRevokeAny}>
                                REVOKE
                            </button>
                        )
                    }
                </div>
            </div>
        )
    }
}