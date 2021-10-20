const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
	id: {
		type: Number,
	},
});

OrderSchema.methods.validate = function (params) {
	if (isNaN(params.amount)) {
		return { success: false, msg: 'invalid amount' };
	}
};

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
