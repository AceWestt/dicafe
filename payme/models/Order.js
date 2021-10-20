const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
	products_ids: {
		type: String,
	},
	amount: {
		type: Number,
	},
	state: {
		type: Number,
	},
	user_id: {
		type: Number,
	},
	phone: {
		type: String,
	},
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
