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
const ERROR_TRANSACTION_NOT_FOUND = -31003;
const ERROR_COULD_NOT_CANCEL = -31007;
const ERROR_METHOD_NOT_FOUND = -32601;
const ERROR_INTERNAL_SERVER = -32400;

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

const TRANSACTION_TIMOUT = 43200000;

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
				break;
			case 'CreateTransaction':
				CreateTransaction(res, reqId, params);
				break;
			case 'CheckTransaction':
				CheckTransaction(res, reqId, params);
				break;
			case 'PerformTransaction':
				PerformTransaction(res, reqId, params);
				break;
			case 'CancelTransaction':
				CancelTransaction(res, reqId, params);
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
		order_id: order_id,
	});

	if (transaction && (transaction.state === 1 || transaction.state === 2)) {
		return res.json({
			jsonrpc: JSON_RPC_VERSION,
			id: reqid,
			error: {
				code: ERROR_INVALID_ACCOUNT,
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

const CreateTransaction = async (res, reqid, params) => {
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
	let transaction = await Transaction.findOne({
		order_id: order_id,
		state: 1 || 2,
	});
	if (transaction) {
		if (
			(transaction.state === 1 || transaction.state === 2) &&
			transaction.paycom_transaction_id !== params.id
		) {
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				error: {
					code: ERROR_INVALID_ACCOUNT,
					message: ERROR_COULD_NOT_PERFORM_MSG,
				},
			});
		}
	}
	transaction = await Transaction.findOne({
		paycom_transaction_id: params.id,
	});
	if (transaction) {
		if (transaction.state !== 1) {
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				error: {
					code: ERROR_COULD_NOT_PERFORM_MSG,
					message: 'Transaction found, but is not active',
				},
			});
		} else if (transaction.isExpired()) {
			transaction.cancel(4);
			await transaction.save((err) => {
				if (err) {
					return res.json({
						jsonrpc: JSON_RPC_VERSION,
						id: reqid,
						error: {
							code: ERROR_INTERNAL_SERVER,
							message: 'Could not cancel transaction due to expiration',
						},
					});
				}
			});
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				error: {
					code: ERROR_COULD_NOT_PERFORM,
					message: 'Transaction is expired.',
				},
			});
		} else {
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				result: {
					create_time: Date.parse(transaction.creat_time),
					perform_time: !Date.parse(transaction.perform_time)
						? 0
						: Date.parse(transaction.perform_time),
					cancel_time: !Date.parse(transaction.cancel_time)
						? 0
						: Date.parse(transaction.perform_time),
					transaction: transaction._id,
					state: transaction.state,
					reason: transaction.reason,
					receivers: transaction.receivers,
				},
			});
		}
	} else {
		if (Date.now() - params.time >= TRANSACTION_TIMOUT) {
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				error: {
					code: ERROR_INVALID_ACCOUNT,
					message: {
						ru: `С даты создания транзакции прошло ${TRANSACTION_TIMOUT} мс.`,
						uz: `Tranzaksiya yaratilgan sanadan ${TRANSACTION_TIMOUT} ms o'tgan.`,
						en: `${TRANSACTION_TIMOUT} ms passed since the create time of the transaction.`,
					},
					data: 'time',
				},
			});
		}
		const creat_time = Date.now();
		const newTransaction = await new Transaction({
			paycom_transaction_id: params.id,
			paycom_time: params.time,
			paycom_time_datetime: params.time,
			creat_time: creat_time,
			state: 1,
			amount: params.amount,
			order_id: order_id,
		});
		try {
			await newTransaction.save((err) => {
				if (err) {
					return res.json({
						jsonrpc: JSON_RPC_VERSION,
						id: reqid,
						error: {
							code: ERROR_INTERNAL_SERVER,
							message: 'Could not cancel transaction due to expiration',
						},
					});
				}
			});
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				result: {
					create_time: Date.parse(newTransaction.creat_time),
					transaction: newTransaction._id,
					state: newTransaction.state,
					receivers: null,
				},
			});
		} catch (error) {
			console.error(error);
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				error: {
					code: ERROR_INTERNAL_SERVER,
					message: 'Could not cancel transaction due to expiration',
				},
			});
		}
	}
};

const CheckTransaction = async (res, reqid, params) => {
	const transaction = await Transaction.findOne({
		paycom_transaction_id: params.id,
	});
	if (!transaction) {
		return res.json({
			jsonrpc: JSON_RPC_VERSION,
			id: reqid,
			error: {
				code: ERROR_TRANSACTION_NOT_FOUND,
				message: 'Transaction not found.',
			},
		});
	}
	return res.json({
		jsonrpc: JSON_RPC_VERSION,
		id: reqid,
		result: {
			create_time: Date.parse(transaction.creat_time),
			perform_time: !Date.parse(transaction.perform_time)
				? 0
				: Date.parse(transaction.perform_time),
			cancel_time: !Date.parse(transaction.cancel_time)
				? 0
				: Date.parse(transaction.perform_time),
			transaction: transaction._id,
			state: transaction.state,
			reason: transaction.reason,
			receivers: transaction.receivers,
		},
	});
};

const PerformTransaction = async (res, reqid, params) => {
	const transaction = await Transaction.findOne({
		paycom_transaction_id: params.id,
	});
	if (!transaction) {
		return res.json({
			jsonrpc: JSON_RPC_VERSION,
			id: reqid,
			error: {
				code: ERROR_TRANSACTION_NOT_FOUND,
				message: 'Transaction not found.',
			},
		});
	}
	switch (transaction.state) {
		case 1:
			if (transaction.isExpired()) {
				transaction.cancel(4);
				await transaction.save((err) => {
					console.error(err);
					return res.json({
						jsonrpc: JSON_RPC_VERSION,
						id: reqid,
						error: {
							code: ERROR_INTERNAL_SERVER,
							message: 'Could not cancel transaction due to expiration',
						},
					});
				});
				return res.json({
					jsonrpc: JSON_RPC_VERSION,
					id: reqid,
					error: {
						code: ERROR_COULD_NOT_PERFORM,
						message: 'Transaction is expired',
					},
				});
			} else {
				const order_id = transaction.order_id;
				const order = await Order.findById(order_id);
				order.state = 2;
				await order.save((err) => {
					if (err) {
						console.error(err);
						return res.json({
							jsonrpc: JSON_RPC_VERSION,
							id: reqid,
							error: {
								code: ERROR_INTERNAL_SERVER,
								message: 'Could not cancel transaction due to expiration',
							},
						});
					}
				});
				transaction.state = 2;
				transaction.perform_time = Date.now();
				await transaction.save((err) => {
					if (err) {
						console.error(err);
						return res.json({
							jsonrpc: JSON_RPC_VERSION,
							id: reqid,
							error: {
								code: ERROR_INTERNAL_SERVER,
								message: 'Could not cancel transaction due to expiration',
							},
						});
					}
				});
				return res.json({
					jsonrpc: JSON_RPC_VERSION,
					id: reqid,
					result: {
						transaction: transaction._id,
						perform_time: Date.parse(transaction.perform_time),
						state: transaction.state,
					},
				});
			}
			break;
		case 2:
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				result: {
					transaction: transaction._id,
					perform_time: Date.parse(transaction.perform_time),
					state: transaction.state,
				},
			});
			break;
		default:
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				error: {
					code: ERROR_COULD_NOT_PERFORM,
					message: 'Could not perform this operation.',
				},
			});
	}
};

const CancelTransaction = async (res, reqid, params) => {
	const transaction = await Transaction.findOne({
		paycom_transaction_id: params.id,
	});
	if (!transaction) {
		return res.json({
			jsonrpc: JSON_RPC_VERSION,
			id: reqid,
			error: {
				code: ERROR_TRANSACTION_NOT_FOUND,
				message: 'Transaction not found.',
			},
		});
	}
	switch (transaction.state) {
		case -1:
		case -2:
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				result: {
					create_time: Date.parse(transaction.creat_time),
					perform_time: !Date.parse(transaction.perform_time)
						? 0
						: Date.parse(transaction.perform_time),
					cancel_time: !Date.parse(transaction.cancel_time)
						? 0
						: Date.parse(transaction.perform_time),
					transaction: transaction._id,
					state: transaction.state,
					reason: transaction.reason,
					receivers: transaction.receivers,
				},
			});
			break;
		case 1: {
			transaction.cancel(params.reason);
			await transaction.save((err) => {
				if (err) {
					console.error(err);
					return res.json({
						jsonrpc: JSON_RPC_VERSION,
						id: reqid,
						error: {
							code: ERROR_INTERNAL_SERVER,
							message: 'Could not cancel transaction due to expiration',
						},
					});
				}
			});
			const order_id = transaction.order_id;
			const order = await Order.findById(order_id);
			order.state = 3;
			await order.save((err) => {
				if (err) {
					console.error(err);
					return res.json({
						jsonrpc: JSON_RPC_VERSION,
						id: reqid,
						error: {
							code: ERROR_INTERNAL_SERVER,
							message: 'Could not cancel transaction due to expiration',
						},
					});
				}
			});
			return res.json({
				jsonrpc: JSON_RPC_VERSION,
				id: reqid,
				result: {
					create_time: Date.parse(transaction.creat_time),
					perform_time: !Date.parse(transaction.perform_time)
						? 0
						: Date.parse(transaction.perform_time),
					cancel_time: !Date.parse(transaction.cancel_time)
						? 0
						: Date.parse(transaction.perform_time),
					transaction: transaction._id,
					state: transaction.state,
					reason: transaction.reason,
					receivers: transaction.receivers,
				},
			});
			break;
		}
		case 2:
			const order_id = transaction.order_id;
			const order = await Order.findById(order_id);
			if (order.allowCancel()) {
				transaction.cancel(params.reason);
				await transaction.save((err) => {
					if (err) {
						console.error(err);
						return res.json({
							jsonrpc: JSON_RPC_VERSION,
							id: reqid,
							error: {
								code: ERROR_INTERNAL_SERVER,
								message: 'Could not cancel transaction due to expiration',
							},
						});
					}
				});
				order.state = 3;
				await order.save((err) => {
					if (err) {
						console.error(err);
						return res.json({
							jsonrpc: JSON_RPC_VERSION,
							id: reqid,
							error: {
								code: ERROR_INTERNAL_SERVER,
								message: 'Could not cancel transaction due to expiration',
							},
						});
					}
				});
				return res.json({
					jsonrpc: JSON_RPC_VERSION,
					id: reqid,
					result: {
						create_time: Date.parse(transaction.creat_time),
						perform_time: !Date.parse(transaction.perform_time)
							? 0
							: Date.parse(transaction.perform_time),
						cancel_time: !Date.parse(transaction.cancel_time)
							? 0
							: Date.parse(transaction.perform_time),
						transaction: transaction._id,
						state: transaction.state,
						reason: transaction.reason,
						receivers: transaction.receivers,
					},
				});
			} else {
				return res.json({
					jsonrpc: JSON_RPC_VERSION,
					id: reqid,
					error: {
						code: ERROR_COULD_NOT_CANCEL,
						message:
							'Could not cancel transaction. Order is delivered/Service is completed.',
					},
				});
			}
			break;
	}
};
