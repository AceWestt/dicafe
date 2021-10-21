const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
	products_ids: {
		type: [],
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	state: {
		type: Number,
		required: true,
	},
	user_id: {
		type: Number,
	},
	phone: {
		type: String,
		required: true,
	},
});

OrderSchema.methods.allowCancel = () => true;

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
