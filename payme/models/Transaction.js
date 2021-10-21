const mongoose = require('mongoose');

const TIMEOUT = 43200000;

const TransactionSchema = new mongoose.Schema({
	paycom_transaction_id: {
		type: String,
		required: true,
	},
	paycom_time: {
		type: String,
		required: true,
	},
	paycom_time_datetime: {
		type: Date,
		require: true,
	},
	creat_time: {
		type: Date,
		required: true,
	},
	perform_time: {
		type: Date,
		default: null,
	},
	cancel_time: {
		type: Date,
		default: null,
	},
	amount: {
		type: Number,
		required: true,
	},
	state: { type: Number, required: true },
	reason: { type: Number, required: true },
	receivers: { type: String, default: null },
	order_id: { type: Number, required: true },
});

TransactionSchema.methods.isExpired = function () {
	const diff = this.creat_time - Date.now();
	if (diff > TIMEOUT) {
		return true;
	}
	return false;
};

Transaction.methods.cancel = async function (reason) {
	this.cancel_time = Date.now();
	if (this.state === 2) {
		this.state = -2;
	} else {
		this.state = -1;
	}
};

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;