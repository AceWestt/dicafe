const ErrorResponse = require('../../utils/errorResponse');
const Order = require('../models/Order');

exports.add = async (req, res, next) => {
	const body = req.body;
	try {
		const order = await new Order({
			products_ids: body.product_ids,
			product_list: body.product_list,
			customer: body.customer,
			amount: body.amount,
			state: body.state,
		});
		await order.save((err) => {
			if (err) {
				return next(new ErrorResponse('Could not create order', 500));
			}
		});
		res.status(200).json({ success: true, data: order });
	} catch (error) {
		next(error);
	}
};
