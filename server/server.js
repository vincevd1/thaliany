const express = require('express');
const app = express();

let outgoingAnytimers = [
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
	}
]

let incomingAnytimers = [
	{
		id: 0,
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

app.use((req, res, next) => {
    if(req.headers.authorization) {
      return res.sendStatus(400)  
    } 

    next();
})

app.get('/api/anytimers/confirmed/incoming', (req, res) => {

})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})