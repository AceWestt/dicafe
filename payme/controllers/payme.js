const Merchant = require('../models/Merchant');
const config = require('../config/config');
const validate = require('../utils/validate');

const JSON_RPC_VERSION = '2.0';
const ERROR_INSUFFICIENT_PRIVILEGE = -32504;
const ERROR_INVALID_AMOUNT = -31001;
const ERROR_METHOD_NOT_FOUND = -32601;

const ERROR_INSUFFICIENT_PRIVILEGE_MSG =
	'Insufficient privilege to perform this method.';
const ERROR_INVALID_AMOUNT_MSG = 'Incorrect amount!';
const ERROR_METHOD_NOT_FOUND_MSG = 'Method not found!';

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
		} else {
			respond({
				error: {
					code: -31001,
					message: 'Incorrect amount',
					data: null,
				},
			});
		}
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
			respond({
				error: {
					code: -31001,
					message: 'Incorrect amount',
					data: null,
				},
			});
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

exports.paymeAnother = (req, res, next) => {
	const rpcRequest = req.body;
	const headers = req.headers;
	const reqId = rpcRequest.id;
	const method = rpcRequest.method;
	const params = rpcRequest.params;

	const merchant = new Merchant(config);

	const isauthorized = merchant.authorize(req.headers);
	if (!isauthorized) {
		res.json({
			jsonrpc: '2.0',
			id: reqId,
			error: {
				code: ERROR_INSUFFICIENT_PRIVILEGE,
				message: ERROR_INSUFFICIENT_PRIVILEGE_MSG,
			},
		});
	}
	switch (method) {
		case 'CheckPerformTransaction':
			CheckPerformTransaction(res, reqId, params);
			break;
		case 'CreateTransaction':
			CreateTransaction(res, reqId, params);
			break;
		default:
			res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqId,
				error: {
					code: ERROR_METHOD_NOT_FOUND,
					message: ERROR_METHOD_NOT_FOUND_MSG,
				},
			});
	}
	res.json({
		jsonrpc: JSON_RPC_VERSION,
		id: reqId,
		error: {
			code: ERROR_METHOD_NOT_FOUND,
			message: ERROR_METHOD_NOT_FOUND_MSG,
		},
	});
};

const CheckPerformTransaction = (res, reqid, params) => {
	const valid = validate(params);
	if (!valid.valid) {
		if (valid.msg === ERROR_INVALID_AMOUNT_MSG) {
			res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				error: {
					code: ERROR_INVALID_AMOUNT,
					message: ERROR_INVALID_AMOUNT_MSG,
				},
			});
		}
	}
};

const CreateTransaction = (res, reqId, params) => {
	const valid = validate(params);
	if (!valid.valid) {
		if (valid.msg === ERROR_INVALID_AMOUNT_MSG) {
			res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				error: {
					code: ERROR_INVALID_AMOUNT,
					message: ERROR_INVALID_AMOUNT_MSG,
				},
			});
		}
	}
};

const response = (reqId, data) => {
	return {
		jsonrpc: '2.0',
		id: reqId,
		data,
	};
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
