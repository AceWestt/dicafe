const ErrorResponse = require('../../utils/errorResponse');
const Order = require('../models/Order');

exports.add = async (req, res, next) => {
	const body = req.body;
	console.log(body);
	try {
		const order = await new Order({
			product_ids: body.products_ids,
			amount: body.amount,
			state: body.state,
			phone: body.phone,
		});
		await order.save((err) => {
			if (err) {
				return next(new ErrorResponse('Could not create order', 500));
			}
			res.status(200).json({ success: true, data: order });
		});
	} catch (error) {
		next(error);
	}
};
