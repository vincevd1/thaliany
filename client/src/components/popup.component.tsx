import React, { useState } from "react";
import './popup.component.css'

interface PopupProps {
    title: string,
    children: React.ReactNode, 
    button: React.ReactElement
}

export default function Popup({ title, children, button }: PopupProps) {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            {
                React.cloneElement(button, {
                    onClick: () => {
                        if(button.props.onClick) {
                            button.props.onClick();
                        }
                        
                        setVisible(true);
                    }
                })
            }

            {
                visible ? (
                    <div className="popup">
                        <div className="popup-header">
                            <h2 className="popup-title">{ title }</h2>
                            <span className="close-popup" onClick={() => setVisible(false)}>&#x2715;</span>
                        </div>
                        <div className="popup-content">
                            { children }
                        </div>
                    </div>
                ) : null
            }
        </>
    )
}