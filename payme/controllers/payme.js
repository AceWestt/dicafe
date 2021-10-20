const Merchant = require('../models/Merchant');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const config = require('../config/config');
const validate = require('../utils/validate');

const JSON_RPC_VERSION = '2.0';
const ERROR_INSUFFICIENT_PRIVILEGE = -32504;
const ERROR_INVALID_AMOUNT = -31001;
const ERROR_INVALID_ACCOUNT = -31050;
const ERROR_COULD_NOT_PERFORM = -31008;
const ERROR_METHOD_NOT_FOUND = -32601;

const ERROR_INSUFFICIENT_PRIVILEGE_MSG =
	'Insufficient privilege to perform this method.';
const ERROR_INVALID_AMOUNT_MSG = 'Incorrect amount!';
const ERROR_INVALID_ACCOUNT_MSG = 'Invalid account!';
const ERROR_COULD_NOT_PERFORM_MSG =
	'There is other active/completed transaction for this order.';
const ERROR_METHOD_NOT_FOUND_MSG = 'Method not found!';

const errorInvalidAccountMsgLocale = {
	ru: 'Неверный код заказа.',
	uz: 'Harid kodida xatolik.',
	en: 'Incorrect order code.',
};

exports.paymeAnother = async (req, res, next) => {
	try {
		const rpcRequest = req.body;
		const headers = req.headers;
		const reqId = rpcRequest.id;
		const method = rpcRequest.method;
		const params = rpcRequest.params;

		const merchant = new Merchant(config);

		const isauthorized = merchant.authorize(headers);
		if (!isauthorized) {
			return res.json({
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
				console.log('ss');
				break;
			case 'CreateTransaction':
				CreateTransaction(res, reqId, params);
				break;
			default:
				return res.json({
					jsonrpc: JSON_RPC_VERSION,
					id: reqId,
					error: {
						code: ERROR_METHOD_NOT_FOUND,
						message: ERROR_METHOD_NOT_FOUND_MSG,
					},
				});
		}
	} catch (error) {
		return res.json({
			jsonrpc: JSON_RPC_VERSION,
			id: reqId,
			error: {
				code: ERROR_METHOD_NOT_FOUND,
				message: ERROR_METHOD_NOT_FOUND_MSG,
			},
		});
	}
};

const CheckPerformTransaction = async (res, reqid, params) => {
	const valid = validate(params);
	if (!valid.valid) {
		if (valid.msg === ERROR_INVALID_AMOUNT_MSG) {
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				error: {
					code: ERROR_INVALID_AMOUNT,
					message: ERROR_INVALID_AMOUNT_MSG,
				},
			});
		}
		if (valid.msg === ERROR_INVALID_ACCOUNT_MSG) {
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				error: {
					code: ERROR_INVALID_ACCOUNT,
					message: errorInvalidAccountMsgLocale,
					data: 'order_id',
				},
			});
		}
	}
	const order_id = params.account.order_id || params.account.DiCafe;
	const order = await Order.findById(order_id);
	if (!order) {
		return res.json({
			jsonrpc: JSON_RPC_VERSION,
			id: reqid,
			error: {
				code: ERROR_INVALID_ACCOUNT,
				message: errorInvalidAccountMsgLocale,
				data: 'order_id',
			},
		});
	}
	if (100 * order.amount != params.amount) {
		return res.json({
			jsonrpc: JSON_RPC_VERSION,
			id: reqid,
			error: {
				code: ERROR_INVALID_AMOUNT,
				message: ERROR_INVALID_AMOUNT_MSG,
			},
		});
	}
	if (order.state !== 1) {
		return res.json({
			jsonrpc: JSON_RPC_VERSION,
			id: reqid,
			error: {
				code: ERROR_INVALID_ACCOUNT,
				message: errorInvalidAccountMsgLocale,
				data: 'order_id',
			},
		});
	}

	const transaction = await Transaction.findOne({
		paycom_transaction_id: reqid,
	});

	if (transaction && (transaction.state === 1 || transaction.state === 2)) {
		return res.json({
			jsonrpc: JSON_RPC_VERSION,
			id: reqid,
			error: {
				code: ERROR_COULD_NOT_PERFORM,
				message: ERROR_COULD_NOT_PERFORM_MSG,
			},
		});
	}

	return res.json({
		jsonrpc: JSON_RPC_VERSION,
		id: reqid,
		result: {
			allow: true,
		},
	});
};

const CreateTransaction = (res, reqId, params) => {
	const valid = validate(params);
	if (!valid.valid) {
		if (valid.msg === ERROR_INVALID_AMOUNT_MSG) {
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqId,
				error: {
					code: ERROR_INVALID_AMOUNT,
					message: ERROR_INVALID_AMOUNT_MSG,
				},
			});
		}
		if (valid.msg === ERROR_INVALID_ACCOUNT_MSG) {
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqId,
				error: {
					code: ERROR_INVALID_ACCOUNT,
					message: errorInvalidAccountMsgLocale,
					data: 'order_id',
				},
			});
		}
	}
	return res.json({
		jsonrpc: JSON_RPC_VERSION,
		id: reqId,
		error: {
			code: ERROR_METHOD_NOT_FOUND,
			message: ERROR_METHOD_NOT_FOUND_MSG,
		},
	});
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
