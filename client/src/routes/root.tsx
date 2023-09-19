import { Outlet } from 'react-router-dom'
import Header from '../components/header.component'

export default function Root() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>
    </>
  )
}
