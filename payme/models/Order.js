const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
	products_ids: {
		type: [],
	},
	product_list: {
		type: [],
	},
	customer: {
		type: Object,
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
});

OrderSchema.methods.allowCancel = () => true;

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
