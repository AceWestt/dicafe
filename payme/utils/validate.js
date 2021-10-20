const ERROR_INVALID_AMOUNT = 'Incorrect amount!';
const ERROR_INVALID_ACCOUNT = 'Invalid account!';

const validate = (params) => {
	if (isNaN(params.amount)) {
		return respond(false, ERROR_INVALID_AMOUNT);
	} else {
		if (params.amount <= 300) {
			return respond(false, ERROR_INVALID_AMOUNT);
		}
	}
	if (!params.account) {
		return respond(false, ERROR_INVALID_ACCOUNT);
	} else {
		if (!params.account.order_id && !params.account.DiCafe) {
			console.log('account is invalid', params.account, params.account.DiCafe);
			return respond(false, ERROR_INVALID_ACCOUNT);
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
