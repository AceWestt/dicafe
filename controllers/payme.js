const ErrorResponse = require('../utils/errorResponse');

exports.payme = async (req, res, next) => {
	const body = req.body;
	console.log(body);
	res.status(200).json({ data: 'payme controller' });
};
