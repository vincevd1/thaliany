require('dotenv').config()

const express = require('express');
const cors = require('cors')
const app = express();

let confirmedAnyTimers = [
	{
		id: 0,
		owner_id: 205,
		recipient_id: 205,
		amount: 1,
		type: 'Other',
		description: `Broek uit op je hoofd`
	},
	{
		id: 1,
		owner_id: 205,
		recipient_id: 112,
		amount: 2,
		type: 'Beer',
		description: `Trek 'n bak`
	},
	{
		id: 2,
		owner_id: 1,
		recipient_id: 205,
		amount: 1,
		type: 'Beer',
		description: `Trek 'n bak`
	},
	{
		id: 1,
		owner_id: 1,
		recipient_id: 205,
		amount: 2,
		type: 'Beer',
		description: `Trek 'n bak`
	}
]

let requestedAnyTimers = [
	{
		id: 0,
		owner_id: 205,
		recipient_id: 205,
		amount: 1,
		type: 'Other',
		description: `Broek uit op je hoofd`
	},
	{
		id: 1,
		owner_id: 205,
		recipient_id: 112,
		amount: 2,
		type: 'Beer',
		description: `Trek 'n bak`
	},
	{
		id: 2,
		owner_id: 1,
		recipient_id: 205,
		amount: 1,
		type: 'Beer',
		description: `Trek 'n bak`
	},
	{
		id: 1,
		owner_id: 1,
		recipient_id: 205,
		amount: 2,
		type: 'Beer',
		description: `Trek 'n bak`
	}
]

app.use(cors({
	origin: ['http://localhost:5173']
}))

app.use((req, res, next) => {
    if(!req.headers.authorization) {
      return res.sendStatus(400)  
    } 

    next();
})

// get the user
app.use(async (req, res, next) => {
	const response = await fetch(`${process.env.CONCREXIT_URI}/api/v2/members/me`, {
		method: "GET",
		headers: {
			'Authorization': req.headers.authorization
		}
	})

	const user = await response.json();
	res.locals.user = user;
	next()
})

app.get('/api/anytimers/confirmed/incoming', (req, res) => {
	const anyTimer = confirmedAnyTimers.filter(anytimer => anytimer.recipient_id == res.locals.user.pk);

	res.send(anyTimer)
})

app.get('/api/anytimers/confirmed/outgoing', (req, res) => {
	const anyTimer = confirmedAnyTimers.filter(anytimer => anytimer.owner_id == res.locals.user.pk);

	res.send(anyTimer)
})

app.get('/api/anytimers/requests/incoming', (req, res) => {
	const anyTimer = requestedAnyTimers.filter(anytimer => anytimer.recipient_id == res.locals.user.pk);

	res.send(anyTimer)
})

app.get('/api/anytimers/requests/outgoing', (req, res) => {
	const anyTimer = requestedAnyTimers.filter(anytimer => anytimer.owner_id == res.locals.user.pk);

	res.send(anyTimer)
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})