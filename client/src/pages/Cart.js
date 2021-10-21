import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context';
import closuButtonImg from './imgs/cart/closeCart.svg';
import line from './imgs/cart/line.svg';
import orderBtnBg from './imgs/cart/orderButtonBg.svg';
import incrementBtn from './imgs/cart/incrementButton.svg';
import decrementBtn from './imgs/cart/decrementButton.svg';
import axios from 'axios';

const Cart = () => {
	const { isCartOpen, setIsCartOpen, lang, cartList, setCartList } =
		useAppContext();
	const [totalPrice, setTotalPrice] = useState(0);

	useEffect(() => {
		let total = 0;
		cartList.map((c) => {
			total += c.amount * c.price;
			return c;
		});
		setTotalPrice(total);
	}, [cartList]);

	const handleDecrement = (c, index) => {
		if (c.amount > 1) {
			let newCartList = cartList.map((item, i) => {
				if (i === index) {
					item.amount = item.amount - 1;
				}
				return item;
			});
			setCartList(newCartList);
		} else {
			setCartList(cartList.filter((c, i) => i !== index));
		}
	};

	const handleIncrement = (index) => {
		let newCartList = cartList.map((item, i) => {
			if (i === index) {
				item.amount = item.amount + 1;
			}
			return item;
		});
		setCartList(newCartList);
	};

	const handleSubmit = async () => {
		const product_ids = cartList.map((i) => i.id);
		const amount = totalPrice;
		const state = 1;
		const phone = '+998945677776';

		const items = cartList.map((i) => {
			const item = {
				title: i.title.ru,
				price: i.price,
				count: i.amount,
			};
			return item;
		});

		const detail = {
			items: items,
		};

		const detailJson = JSON.stringify(detail);
		const encodedDetailBase64 = Buffer.from(detailJson).toString('base64');
		const order = {
			product_ids,
			amount,
			state,
			phone,
		};

		try {
			const res = await axios.post('/api/order', order);
			if (res.data.success) {
				const config = {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				};
				const createdOrder = res.data.data;
				const formData = new FormData();
				const merchant = '61681fff6e71f7f8df534653';
				formData.append('merchant', merchant);
				formData.append('amount', createdOrder.amount * 100);
				formData.append('account[order_id]', createdOrder._id);
				formData.append('detail', encodedDetailBase64);
				formData.append('callback', 'https://dicafe.uz/');
				// const encodedString = Buffer.from(
				// 	`m=${merchant};ac.order_id=${createdOrder._id};ac.phone=${
				// 		createdOrder.phone
				// 	};a=${500 * 100};c=https://dicafe.uz/`
				// ).toString('base64');
				// window.location.replace(`https://checkout.paycom.uz/${encodedString}`);
				try {
					const paymeRes = await axios.post(
						'https://checkout.paycom.uz',
						formData,
						config
					);
					console.log(paymeRes);
				} catch (error) {
					console.error(error);
					console.log(error.response);
				}
			}
		} catch (error) {
			console.error(error);
			console.log(error.response);
		}
	};

	if (isCartOpen) {
		return (
			<div className="cart-modal" id="cart-modal">
				<div className="cart-modal__container">
					<div className="header">
						<div className="top">
							<span>{lang === 'ru' ? 'Корзина' : 'Savat'}</span>
							<img
								src={closuButtonImg}
								alt="close cart"
								onClick={() => setIsCartOpen(false)}
							/>
						</div>
						<div className="bottom">
							<img src={line} alt="line" />
						</div>
					</div>
					<div className="body">
						{cartList.length > 0 ? (
							cartList.map((c, index) => {
								return (
									<div className="item" key={`cart-item_${index}`}>
										<div className="img">
											<img src={c.img} alt="item" />
										</div>
										<div className="text">
											<div className="title">
												<span>{c.title[lang]}</span>
												<span>x{c.amount}</span>
											</div>
											<div className="subtitle">{c.subtitle[lang]}</div>
											<div className="amount-control">
												<img
													src={decrementBtn}
													alt="decrement"
													onClick={() => handleDecrement(c, index)}
												/>
												<img
													src={incrementBtn}
													alt="increment"
													onClick={() => handleIncrement(index)}
												/>
											</div>
											<div className="price">
												{c.price * c.amount} {lang === 'ru' ? 'сум' : "so'm"}
											</div>
										</div>
									</div>
								);
							})
						) : (
							<p className="empty-msg">
								{lang === 'ru' ? ' Ваша корзина пуста ' : "Savatingiz bo'sh"}
							</p>
						)}
					</div>
					<div className="footer">
						<div className="total">
							{lang === 'ru' ? 'Итогавая цена:' : 'Umumiy narxi:'} {totalPrice}{' '}
							{lang === 'ru' ? 'сум' : "so'm"}
						</div>
						<div className="line">
							<img src={line} alt="line" />
						</div>
						<div className="btn-holder">
							<div className="order-button" onClick={handleSubmit}>
								<img src={orderBtnBg} alt="orderBtn" />
								<span>{lang === 'ru' ? 'Заказать' : 'Buyurtma berish'}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	return '';
};

export default Cart;
