import { useRouteError } from 'react-router-dom'
import Header from './components/header.component';
import './error.page.css'

export default function ErrorPage() {
    const error: any = useRouteError();

    return (
        <>
            <Header />
            <div className="error-page">
                <div className="error-code">404</div>
                <div><i>{error.statusText || error.message}</i></div>
            </div>
        </>
    )
}