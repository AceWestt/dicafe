const ErrorResponse = require('../utils/errorResponse');
const PaycomError = require('../utils/paycomError');
const { JSONRPCServer } = require('json-rpc-2.0');

const rpcServer = new JSONRPCServer();

rpcServer.addMethod('CheckPerformTransaction', (req, res, next) => {
	return { req, res, next };
});

exports.payme = (req, res, next) => {
	const jsonRPCRequest = req.body;
	// const userID = getUserID(req);

	rpcServer.receive(jsonRPCRequest).then((jsonRPcResponse) => {
		if (jsonRPcResponse) {
			// switch (jsonRPCRequest.method) {
			// 	case 'CheckPerformTransaction':
			// 		res.json({ allow: true });
			// 		break;
			// }
			res.json(jsonRPcResponse);
		} else {
			res.sendStatus(204);
		}
	});
};
