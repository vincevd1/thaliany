const express = require('express');
const app = express();

app.get('/api/anytimers/me', (req, res) => {
    res.send('hello');
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})