const mongoose = require('mongoose');

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
	reasons: { type: Number, required: true },
	receivers: { type: String, default: null },
	order_id: { type: Number, required: true },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
