const Merchant = require('../models/Merchant');
const config = require('../config/config');
const validate = require('../utils/validate');

const ERROR_INSUFFICIENT_PRIVILEGE = '-32504';
const ERROR_INVALID_AMOUNT = '-31001';

exports.payme = (req, res, next) => {
	// const userID = getUserID(req);

	const merchant = new Merchant(config);

	const isauthorized = merchant.authorize(req.headers);

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
		const valid = validate(params);

		if (!valid.valid) {
			if ((valid.msg = 'Incorrect amount!')) {
				respond({
					error: {
						code: -31001,
						message: 'Incorrect amount',
						data: null,
					},
				});
			}
		}

		// respond({ result: { data: 'default' } });
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
