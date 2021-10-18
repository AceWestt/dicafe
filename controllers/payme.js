const ErrorResponse = require('../utils/errorResponse');
const { JSONRPCServer } = require('json-rpc-2.0');

const rpcServer = new JSONRPCServer();

exports.payme = async (req, res, next) => {
	const jsonRPCRequest = req.body;

	rpcServer.receive(jsonRPCRequest).then((jsonRPcResponse) => {
		if (jsonRPcResponse) {
			res.json(jsonRPcResponse);
		} else {
			res.status(204);
		}
	});

	res.status(200).json({ data: 'payme controller' });
};
