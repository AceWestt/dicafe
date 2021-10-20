const ERROR_INVALID_AMOUNT = 'Incorrect amount!';

const validate = (params) => {
	if (isNaN(params.amount)) {
		return respond(false, ERROR_INVALID_AMOUNT);
	} else {
		if (params.amount <= 300) {
			return respond(false, ERROR_INVALID_AMOUNT);
		}
	}
	return respond(true);
};

const respond = (valid, msg = '') => {
	return {
		valid: valid,
		msg: msg,
	};
};

module.exports = validate;
