const express = require('express');
const router = require('./routers/payment');

const ejs = require('ejs');
const engine = require('ejs-mate');

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use('/payment', router);

app.listen(3000, (err) => {
	if (err) throw err;

	console.log('Server listen to port 3000');
});
