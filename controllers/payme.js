const ErrorResponse = require('../utils/errorResponse');

exports.payme = (req, res, next) => {
	// const userID = getUserID(req);
	res.rpc('notification_method', (params) => {});

	res.rpc('CheckPerformTransaction', (params, respond) => {
		respond({ result: params });
	});
};
