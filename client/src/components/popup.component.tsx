import React, { useState } from "react";
import './popup.component.css'
import ReactDOM from "react-dom";

type PopupProps = {
    title: string,
    children: React.ReactNode | ((close: () => void, isOpen: boolean) => React.ReactNode), 
    button: React.ReactElement
    onPopupClose?: () => void
}

export default function Popup({ title, children, button, onPopupClose}: PopupProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    function openPopup() {
        document.body.style.overflow = "hidden";
        setIsOpen(true);
    }

    function closePopup() {
        if(isOpen) { 
            getPopupRoot().remove()
            setIsOpen(false);
            if(onPopupClose) onPopupClose();

            document.body.style.overflow = "auto";
        }
    }

    function isAnotherPopupOpen() {
        return document.getElementById('popup-root') != null
    }

    function getPopupRoot(): HTMLElement {
        let PopupRoot = document.getElementById('popup-root');
      
        if (PopupRoot == null) {
          PopupRoot = document.createElement('div');
          PopupRoot.setAttribute('id', 'popup-root');
          document.body.appendChild(PopupRoot);
        }
      
        return PopupRoot;
    };

    const popupContent =
        <div className="popup">
            <div className="popup-header">
            <h2 className="popup-title">{ title }</h2>
            <span className="close-popup" onClick={closePopup}>&#x2715;</span>
            </div>
                <div className="popup-content">
                {
                children && typeof children === 'function'
                ? children(closePopup, isOpen)
                : children
                }
            </div>
        </div>
    

    return (
        <>
            {
                React.cloneElement(button, {
                    onClick: () => {
                        if (button.props.onClick) {
                            button.props.onClick();
                        }
                        
                        if(!isAnotherPopupOpen()) openPopup();
                    }
                })
            }

            {
                isOpen && ReactDOM.createPortal(popupContent, getPopupRoot())
            }
        </>
    )
}