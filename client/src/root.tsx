import { Outlet } from 'react-router-dom'
import Header from './components/header.component'
import { NotificationProvider } from './components/notification.component'

export default function Root() {
  return (
    <NotificationProvider>
      <Header />

      <main>
        <Outlet />
      </main>
    </NotificationProvider>
  )
}
