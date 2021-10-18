const ErrorResponse = require('../utils/errorResponse');
const PaycomError = require('../utils/paycomError');
const jsonrpc = require('node-express-json-rpc2');

exports.payme = (req, res, next) => {
	// const userID = getUserID(req);
	res.rpc('notification_method', (params) => {});

	res.rpc('CheckPerformTransaction', (params, respond) => {
		respond({ result: params });
	});
};
