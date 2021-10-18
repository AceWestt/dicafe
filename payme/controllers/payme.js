const Merchant = require('../models/Merchant');
const config = require('../config/config');

exports.payme = (req, res, next) => {
	// const userID = getUserID(req);

	const merchant = new Merchant(config);

	const isauthorized = merchant.authorize(req.headers);

	console.log(merchant, isauthorized);

	res.rpc('notification_method', (params) => {});

	res.rpc('CheckPerformTransaction', (params, respond) => {
		if (!isauthorized) {
			return respond({
				error: {
					code: -32504,
					message: 'Insufficient privilege to perform this method.',
					data: null,
				},
			});
		}
		respond({ result: params });
	});
};
