const errorResponse = require('../utils/errorResponse');

const paycomErrorHandler = (err, req, res, next) => {
	let error = { ...err };

	error.message = err.message;
};
