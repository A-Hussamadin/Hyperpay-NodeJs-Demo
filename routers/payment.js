const express = require('express');
var https = require('https');
var querystring = require('querystring');
const axios = require('axios');
const router = express.Router();
var crypto = require('crypto');

const userId = '8a8294175060823a015060866a48002c';
const passsword = 'ZR9zWyRP';
const entityId = '8a82941750616e5a01506185ccc3007c';
const isTest = true;

router.get('/checkout', function(req, res) {
	request(function(responseData) {
		console.log(responseData.id);
		//res.json(responseData);
		const id = responseData.id;
		res.render('home', { checkoutID: id });
	});
});

function request(callback) {
	const host = isTest ? 'test.oppwa.com' : 'oppwa.com';
	const random = Math.random() * (1000 - 50) + 1000;
	var path = '/v1/checkouts';
	var data = querystring.stringify({
		'authentication.userId': userId,
		'authentication.password': passsword,
		'authentication.entityId': entityId,
		amount: '1.00',
		currency: 'SAR',
		paymentType: 'DB',
		merchantTransactionId: random,
		'customer.email': 'hussam@gmail.com',
		testMode: 'EXTERNAL'
	});

	// var d = {
	// 	'authentication.userId': '8ac9a4ca68c1e6640168d9f9c8b65f69',
	// 	'authentication.password': 'Kk8egrf9Fh',
	// 	'authentication.entityId': '8ac9a4ca68c1e6640168d9fa15e35f6d',
	// 	amount: 1,
	// 	currency: 'SAR',
	// 	paymentType: 'DB',
	// 	notificationUrl: 'http://hussamdin.me/notification',
	// 	merchantTransactionId: random,
	// 	'customer.email': 'hussam@gmail.com',
	// 	'customer.givenName': 'hussamadin',
	// 	'customer.surname': 'Ahmad',
	// 	'billing.street1': 'Oliayah',
	// 	'billing.city': 'Riyadh',
	// 	'billing.state': 'Central',
	// 	'billing.country': 'SA'
	// };
	// var data = querystring.stringify(d);
	var options = {
		port: 443,
		host: host,
		path: path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': data.length
		}
	};
	var postRequest = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			jsonRes = JSON.parse(chunk);
			return callback(jsonRes);
		});
	});
	postRequest.write(data);
	postRequest.end();
}

router.get('/status', function(req, res) {
	resultRequest(req.query.resourcePath, function(responseData) {
		const resultCode = responseData.result.code;
		const successPattern = /(000\.000\.|000\.100\.1|000\.[36])/;
		const manuallPattern = /(000\.400\.0[^3]|000\.400\.100)/;
		const match1 = successPattern.test(resultCode);
		const match2 = manuallPattern.test(resultCode);

		if (match1 || match2) {
			res.render('result', { message: 'Payment is Successful' });
		} else {
			res.render('result', { message: 'Payment is Rejected' });
		}
	});
});

function resultRequest(resourcePath, callback) {
	var path = resourcePath;
	path += '?authentication.userId=' + userId;
	path += '&authentication.password=' + passsword;
	path += '&authentication.entityId=' + entityId;
	const host = isTest ? 'test.oppwa.com' : 'oppwa.com';

	const url = 'https://test.oppwa.com' + path;

	axios
		.get(url)
		.then(function(response) {
			// handle success

			try {
				resDate = JSON.parse(response);
			} catch (e) {
				resData = response;
				console.log(resData.data.id);
			}

			return callback(resData.data);
		})
		.catch(function(error) {
			// handle error
			console.log(error);
		});
}

router.get('/webhook', function(req, res) {
	var secretFromConfiguration = 'C66C535F0D3612EE663F52A8BF7CD2C861F3EB4F225B5DB03FFD0B88A99CEEB9';

	// Data from server
	var ivfromHttpHeader = '11E2A46B0D63CE87EB06A6A6';
	var authTagFromHttpHeader = 'A5AAF62871EC9C573BBEC4927151B347';
	var httpBody =
		'CBF1C3F9EDE91751EFF95C4630047236DE6730C6A080A188F38E3FA41D00D9FF930C2E200376D6C6EAB72EE458D7C3A61F18111AB3B77A4E6DF095D13B5F350CD3F2CAE1F4D9F3945192D42FCA883A5F06539EC4C5605D87CB055B44BE3CE3AB91451CFE4E90F0592D57283CF3E1CAEDF2B81B7E5FEA11559AD6713B97C307C792E055114F9583F968EAEAA291F985E1340A67A065966C213F6596BA474C360267C147573B8518112CB76EA3A36B508FDC7541CFE62134924EF7A09B00B3CA7F147C08AE6B88B3FD68359D87AC5909343BE451D88C8573A095716FFB4CEB274EAD88B96BBBA5ED54AE0E8FCB3F99905766AE3504EAFB7E92D9BD16B7F2E3EA8BCDC326F14F9AC0A43D75603CAA3B778CF81E5163C0C163FCA09862DDD2437DD0EB09F5B723F939CF64EE886F9A0EFD74E589147DDF41F3BEA2AFE056D6EF812E0630E79C17C9C9B81A4E56335EDFF9D5B7FA9EF28DF469790EB16457D1B7F0A706C99D4554AF32EB5A4FA2316647DC39894E5FBC27B169DE9011A717E112E4A53E7889ECCAF7D864A2C4D5C3669804EE9F01E9C5F84BA92433025AF6162D8E6BED0005B4454C5DB1B2C15E2260E28F0371E21124608B917620C31725423DAFF3627F5873E9FE9C3664A9FAD8005A43E7CB61C585AC74421824A315B60C06033FDD7CDBE902FD5B7C86BC2003F30673B092269215F43D7BB00AFF7C3F06FE25E43104DE1BEE18D024107789E9E21F18312CB5C66306C125651A9B3C41BE6A8341591E79D0D931268AF9179C221EA87A7132AEF0F8BCBF7818D38D27DF0E14AFFF4DD4699955C134844F56C6994E30EA654772B84CCDEDB41C1DCA8A23ACD55E5BCD3D1E31282964DE1BDE358F4D7E5BBA429B55F53763AC6D1C47369E7F7560E6BD028CDA8464D8280E875571ADCC91B5289C183BE0949C401DDF9CFD560AA74D2F5F0AED4988DA83EC1EC426AB689836134AE472155B9B78D21DB57341CE0467894DB7D0EA881448F7783BA8DD5A4BACB2F4E1334ABF7EBA20592B9A19C803ACC77263A36A9C3967ECC5ABACE975B90307B022562CCEC1EF7804D973345D5B9C535D364299633247D9C0AE2372F06486F00F128139A5F008AE6121046163019E6A72D943D98B23C16704C7AE1596F7ADB144592F19DAE1DBEF4FF3F89D0E0A1F1448813E8DC0F6C7B5944E4478B9A554627AAF32A60B7DF2A821EAA13595804E51DBD8F96041D0E5A894382A1A98F82CE17C95B2703A8A6B0846EA2FE58436B8795BA3A68ABBBFF3AF5FE73BC835260E3423EC83C231E07251B8D587F2FC30B7A6C1A84BB30750C1E32CFEDB9FECD5F9EF71549B58E69164D9E37DEBB56218AAF2C5F8993A1215ED07B0F2187C75FE429FA0EBE8372DE3F64EBD241DD522AC84DAEF332477619F06646AAC59656AE27CCD23F90246C32A1797CE555B5D2CAB07580E5AA8084AAC076AFE295727D740FAD1E0E96F621EA7AA6E7C09B90AC035653B6EB5255E6BB812D6544DBD585513C8D54B42DCDE019530A3918CBAF2A6170B1B5D582987424C29FB14D1BD657B133F4BC48DA2CDBDDD05C9CA9FA99E09401AF06BB2D768C9BC5C0184A482B065BF688E3DBD5FFE6525D8CA03F75D71DB03EC1ADF8F96D1F5FD495A6FB1667A6474637AD95DA08F44106228C4CBA5C81B28222E82C42F1B473D46947043DBAE050CA3C7FC2571283D7439FA1804206C2EEBA6E95C6247E4C42CF6C5F34ABDD2B1B61D521DC368C0588F665F3E189B3513F027575CEB1523B68F76BFF1EA7871E4BEA29A4F03FDA07662';

	// Convert data to process
	var key = new Buffer(secretFromConfiguration, 'hex');
	var iv = new Buffer(ivfromHttpHeader, 'hex');
	var authTag = new Buffer(authTagFromHttpHeader, 'hex');
	var cipherText = new Buffer(httpBody, 'hex');

	// Prepare descryption
	var decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
	decipher.setAuthTag(authTag);

	// Decrypt
	var result = decipher.update(cipherText) + decipher.final();
	console.log(result);
});

module.exports = router;
