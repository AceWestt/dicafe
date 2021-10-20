const Merchant = require('../models/Merchant');
const config = require('../config/config');

const ERROR_INSUFFICIENT_PRIVILEGE = -32504;

exports.payme = (req, res, next) => {
	// const userID = getUserID(req);

	const merchant = new Merchant(config);

	console.log(req.headers);

	const isauthorized = merchant.authorize(req.headers);

	console.log(merchant, isauthorized);

	res.rpc('notification_method', (params) => {});

	res.rpc('CheckPerformTransaction', (params, respond) => {
		if (!isauthorized) {
			respond(
				errorResponse(
					ERROR_INSUFFICIENT_PRIVILEGE,
					'Insufficient privilege to perform this method.',
					null
				)
			);
		}
		respond({ result: { data: 'default' } });
	});
	res.rpc('CreateTransaction', (params, respond) => {
		if (!isauthorized) {
			respond(
				errorResponse(
					ERROR_INSUFFICIENT_PRIVILEGE,
					'Insufficient privilege to perform this method.',
					null
				)
			);
		} else {
		}
	});
	res.rpc('PerformTransaction', (params, respond) => {
		if (!isauthorized) {
			respond(
				errorResponse(
					ERROR_INSUFFICIENT_PRIVILEGE,
					'Insufficient privilege to perform this method.',
					null
				)
			);
		} else {
		}
	});
	res.rpc('CancelTransaction', (params, respond) => {
		if (!isauthorized) {
			respond(
				errorResponse(
					ERROR_INSUFFICIENT_PRIVILEGE,
					'Insufficient privilege to perform this method.',
					null
				)
			);
		} else {
		}
	});
	res.rpc('CheckTransaction', (params, respond) => {
		if (!isauthorized) {
			respond(
				errorResponse(
					ERROR_INSUFFICIENT_PRIVILEGE,
					'Insufficient privilege to perform this method.',
					null
				)
			);
		} else {
		}
	});
	res.rpc('GetStatement', (params, respond) => {
		if (!isauthorized) {
			respond(
				errorResponse(
					ERROR_INSUFFICIENT_PRIVILEGE,
					'Insufficient privilege to perform this method.',
					null
				)
			);
		} else {
		}
	});
	res.rpc('ChangePassword', (params, respond) => {
		if (!isauthorized) {
			respond(
				errorResponse(
					ERROR_INSUFFICIENT_PRIVILEGE,
					'Insufficient privilege to perform this method.',
					null
				)
			);
		} else {
		}
	});
};

const errorResponse = (errcode, message, data) => {
	return {
		error: {
			code: errcode,
			message: message,
			data: data,
		},
	};
};
