import { useState, createContext, useContext } from "react"
import "./notification.component.css"

type NotificationProps = {
    message: string
    close: () => void
}

export function Notification({ message, close }: NotificationProps) {
    // Time for it to expire in seconds
    const notificationTimer = 5;
    const [notifyExpired, setNotifyExpired] = useState(false);

    setTimeout(() => {
        setNotifyExpired(true)
    }, notificationTimer * 1000)

    if(!notifyExpired) {
        return(
            <div className="notification">
                <span>{message}</span>
                <button className="close-notification" onClick={close}>
                    &#x2715;
                </button>
                <div className="timer-bar" style={{ animationDuration: notificationTimer.toString() + "s" }}></div>
            </div>
        )
    }
}

type NotificationType = {
    id: number,
    message: string
}

type NotificationContextVal = {
    notify: (message: string) => void
    close: (id: number) => void
}

const NotificationContext = createContext<NotificationContextVal>({} as NotificationContextVal);

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    function notify(message: string) {
        const newNotification = {
            id: Date.now(),
            message: message
        }

        setNotifications((previousNotifications) => [...previousNotifications, newNotification])
    }

    function closeNotification(id: number) {
        setNotifications((previousNotifications) => 
            previousNotifications.filter(notification => notification.id != id)
        )
    }

    const contextValue = {
        notify: notify,
        close: closeNotification 
    }

    return(
        <>
            <NotificationContext.Provider value={contextValue}>
                { children }
                <div className="notification-root">
                    {
                        notifications && notifications.map(notification => 
                            <Notification 
                                key={notification.id} 
                                message={notification.message} 
                                close={() => closeNotification(notification.id)}
                            />
                        )
                    }
                </div>
            </NotificationContext.Provider>
        </>
    )
}