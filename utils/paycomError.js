class PaycomError extends Error {
	constructor(request_id, message, code, data = null) {
		super(message);
		(this.request_id = request_id), (this.statusCode = code);
		this.data = data;
	}

	static staticCodes() {
		return {
			ERROR_INTERNAL_SYSTEM: -32400,
			ERROR_INSUFFICIENT_PRIVILEGE: -32504,
			ERROR_INVALID_JSON_RPC_OBJECT: -32600,
			ERROR_METHOD_NOT_FOUND: -32601,
			ERROR_INVALID_AMOUNT: -31001,
			ERROR_TRANSACTION_NOT_FOUND: -31003,
			ERROR_INVALID_ACCOUNT: -31050,
			ERROR_COULD_NOT_CANCEL: -31007,
			ERROR_COULD_NOT_PERFORM: -31008,
		};
	}
}
