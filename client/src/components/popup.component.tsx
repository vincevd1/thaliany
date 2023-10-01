import React, { useState } from "react";
import './popup.component.css'

export default function Popup({ children, button }: { children: React.ReactNode, button: React.ReactElement }) {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            {
                React.cloneElement(button, {
                    onClick: () => {
                        if(button.props.onClick) {
                            button.props.onClick();
                        }
                        
                        setVisible(!visible);
                    }
                })
            }

            {
                visible ? (
                    <div className="popup">
                        { children }
                    </div>
                ) : null
            }
        </>
    )
}