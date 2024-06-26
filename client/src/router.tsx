import { createBrowserRouter } from 'react-router-dom'

import Root from './root.tsx'
import ErrorPage from './error.page.tsx'
import AuthCallback from './routes/auth/callback.page.tsx'
import Overview from './routes/overview.page.tsx'
import APIError from './routes/api/error.page.tsx'
import Members from './routes/members/members.page.tsx'
import Requests from './routes/requests/requests.page.tsx'
import Proofs from './routes/proofs/proofs.page.tsx'
import PolicyPage from './routes/policy.page.tsx'

const router = createBrowserRouter([
	{
		path: '',
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/',
				element: <Overview />
				
			},
			{
				path: '/members',
				element: <Members />
			},
			{
				path: '/requests',
				element: <Requests />
			},
			{
				path: '/proofs',
				element: <Proofs />
			},
			{
				path: '/privacy-policy',
				element: <PolicyPage />
			},
			{
				path: '/api/error',
				element: <APIError />
			},
		]
	},
	{
		path: 'auth/callback',
		element: <AuthCallback />
	}
])

export default router;