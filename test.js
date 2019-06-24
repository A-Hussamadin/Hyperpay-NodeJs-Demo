exports.hyperPayStep1 = async (request, response) => {
	try {
		if (!request.headers['authorization'])
			return response.status(400).json({ statusCode: 400, success: 0, msg: AppConstraints.ACCESS_TOKEN.EN });
		let validateToken = await UnivershalFunction.ValidateUserAccessToken(request.headers['authorization']);
		if (!validateToken)
			return response.status(401).json({ statusCode: 401, success: 0, msg: AppConstraints.UNAUTHORIZED.EN });
		let errors = await request.validationErrors();
		if (errors)
			return response.status(400).json({ statusCode: 400, success: 0, msg: errors[0].msg, error: errors });
		const random = Math.random() * (1000 - 50) + 1000;
		console.log(request.body.amount, 'amount');
		console.log(request.body.currency, 'currency');
		console.log(request.body.paymentType, 'paymentType');
		console.log(request.body.notificationUrl, 'notificationUrl');
		let jsonRes = {};
		var path = '/v1/checkouts';
		var d = {
			'authentication.userId': '8ac9a4ca68c1e6640168d9f9c8b65f69',
			'authentication.password': 'Kk8egrf9Fh',
			'authentication.entityId': '8ac9a4ca68c1e6640168d9fa15e35f6d',

			// 'authentication.userId':'8ac7a4c7679c71ed0167b705a421278d',
			// 'authentication.password':'7MbQFsQdCj',
			// 'authentication.entityId':'8ac7a4c7679c71ed0167b705fd7a2791',
			amount: request.body.amount,
			currency: request.body.currency,
			paymentType: request.body.paymentType,
			notificationUrl: request.body.notificationUrl,
			merchantTransactionId: random,
			'customer.email': 'hussam@gmail.com',
			'customer.givenName': 'hussamadin',
			'customer.surname': 'Ahmad',
			'billing.street1': 'Oliayah',
			'billing.city': 'Riyadh',
			'billing.state': 'Central',
			'billing.country': 'SA'
		};

		let findToken = await hypertoken.find({ userId: validateToken._id });
		if (findToken.length > 0) {
			for (let i = 0; i < findToken.length; i++) {
				if (findToken[i].token != '' || findToken[i].token != null) {
					d[`registrations[${[ i ]}].id`] = findToken[i].token;
				}
			}
		}
		console.log(d);
		var data = querystring.stringify(d);
		console.log(data);
		var options = {
			port: 443,
			// host:'test.oppwa.com',
			host: 'oppwa.com',
			path: path,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': data.length
			}
		};
		let x;
		var postRequest = await https.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				console.log('asdadadadasdasda', JSON.parse(chunk));
				jsonRes = JSON.parse(chunk);
				x = JSON.parse(chunk);
				console.log(x);
				return response
					.status(200)
					.json({ success: 1, statusCode: 200, msg: AppConstraints.SUCCESS.EN, data: x });
			});
		});
		postRequest.write(data);
		postRequest.end();
	} catch (err) {
		return response.status(500).json({ statusCode: 500, success: 0, msg: err.message, err: err.message });
	}
};

exports.hyperPayStep2 = async (request, response) => {
	try {
		if (!request.headers['authorization'])
			return response.status(400).json({ statusCode: 400, success: 0, msg: AppConstraints.ACCESS_TOKEN.EN });
		let validateToken = await UnivershalFunction.ValidateUserAccessToken(request.headers['authorization']);
		if (!validateToken)
			return response.status(401).json({ statusCode: 401, success: 0, msg: AppConstraints.UNAUTHORIZED.EN });
		let errors = await request.validationErrors();
		if (errors)
			return response.status(400).json({ statusCode: 400, success: 0, msg: errors[0].msg, error: errors });

		var path = `/v1/checkouts/${request.body.checkoutId}/payment`;
		path += '?authentication.userId=8ac9a4ca68c1e6640168d9f9c8b65f69';
		path += '&authentication.password=Kk8egrf9Fh';
		path += '&authentication.entityId=8ac9a4ca68c1e6640168d9fa15e35f6d';
		var options = {
			port: 443,
			host: 'oppwa.com',
			path: path,
			method: 'GET'
		};
		var postRequest = https.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', async function(chunk) {
				jsonRes = JSON.parse(chunk);
				let findToken = await hypertoken.findOne({ userId: validateToken._id, token: jsonRes.registrationId });
				if (!findToken) {
					if (jsonRes.registrationId != null || jsonRes.registrationId != undefined) {
						let token = new hypertoken();
						token.userId = validateToken._id;
						token.token = jsonRes.registrationId;
						let x = await token.save();
						console.log(x);
					}
				}

				return response
					.status(200)
					.json({ success: 1, statusCode: 200, msg: AppConstraints.SUCCESS.EN, data: jsonRes });
			});
		});
		postRequest.end();
	} catch (err) {
		return response.status(500).json({ statusCode: 500, success: 0, msg: err.message, err: err.message });
	}
};
