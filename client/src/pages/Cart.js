import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context';
import closuButtonImg from './imgs/cart/closeCart.svg';
import line from './imgs/cart/line.svg';
import orderBtnBg from './imgs/cart/orderButtonBg.svg';
import orderBtnBgDisabled from './imgs/cart/orderButtonBgDisabled.svg';
import incrementBtn from './imgs/cart/incrementButton.svg';
import decrementBtn from './imgs/cart/decrementButton.svg';
import customerFormBg from './imgs/cart/customerFormBg.svg';
import customerFormBgMobile from './imgs/cart/customerFormBgMobile.svg';
import closeFormButton from './imgs/cart/closeFormButton.svg';
import sendCustomerFormButton from './imgs/cart/sendButton.svg';
import sendCustomerFormButtonInvalid from './imgs/cart/sendButtonInvalid.svg';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Cart = () => {
	const { isCartOpen, setIsCartOpen, lang, cartList, setCartList, smallScreen } =
		useAppContext();
	const [totalPrice, setTotalPrice] = useState(0);
	const [isUserFormOpen, setIsUserFormOpen] = useState(false);

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

	const handleOrderButtonClick = () => {
		if (cartList.length > 0) {
			setIsUserFormOpen(true);
		}
	};

	if (isCartOpen) {
		return (
			<>
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
								<div
									className={`order-button ${cartList.length > 0 ? '' : 'inactive'}`}
									onClick={handleOrderButtonClick}
								>
									<img
										src={cartList.length > 0 ? orderBtnBg : orderBtnBgDisabled}
										alt="orderBtn"
									/>
									<span>{lang === 'ru' ? 'Заказать' : 'Buyurtma berish'}</span>
								</div>
							</div>
							<p className="empty-message">
								{cartList.length === 0 && 'Добавьте товар в корзину'}
							</p>
						</div>
					</div>
				</div>
				{isUserFormOpen && (
					<UserForm
						setIsUserFormOpen={setIsUserFormOpen}
						smallScreen={smallScreen}
						cartList={cartList}
						totalPrice={totalPrice}
					/>
				)}
			</>
		);
	}
	return '';
};

export default Cart;

const UserForm = ({ setIsUserFormOpen, smallScreen, cartList, totalPrice }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const paymeFormRef = useRef(null);
	const [paymeData, setPaymeData] = useState({});

	const onSubmit = async (data) => {
		const product_ids = cartList.map((i) => i.id);
		const product_list = cartList.map((i) => {
			const item = {
				title: i.title.ru,
				price: i.price * i.amount,
				count: i.amount,
			};
			return item;
		});
		const customer = data.customer;
		const amount = totalPrice;

		const order = {
			product_ids: product_ids,
			product_list: product_list,
			customer: customer,
			amount: amount,
			state: 1,
		};

		try {
			const res = await axios.post('/api/order', order);
			if (res.data.success) {
				const createdOrder = res.data.data;
				const order_id = createdOrder._id;
				const amount = createdOrder.amount * 100;
				const items = createdOrder.product_list.map((i) => {
					const item = {
						title: i.title,
						price: i.price * 100,
						count: i.count,
					};
					return item;
				});
				const detail = {
					items: items,
				};
				const detailJson = JSON.stringify(detail);
				const encodedDetailBase64 = Buffer.from(detailJson).toString('base64');
				const orderCustomer = createdOrder.customer;
				setPaymeData({
					order_id: order_id,
					amount: amount,
					detail: encodedDetailBase64,
					customer: orderCustomer,
				});
				paymeFormRef.current.submit();
			}
		} catch (error) {
			console.error(error);
			console.log(error.response);
		}
	};

	const handleNameChange = (e) => {
		let value = e.target.value;
		value = value.replace(/[^a-zA-Zа-яА-ЯёЁ ]+/g, '');
		value = value.replace(/[ ]{2,}/g, ' ');
		value = value.replace(/(^|\s)[a-zA-Zа-яА-ЯёЁ]/g, (s) => s.toUpperCase());
		e.target.value = value;
	};

	const handlePhoneChange = (e) => {
		let value = e.target.value;
		const match = value
			.replace(/^\+998/, '')
			.replace(/\D/g, '')
			.match(/(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
		value = !match[2]
			? '+998 ' + (match[1] ? '(' + match[1] : '')
			: '+998 (' +
			  match[1] +
			  ') ' +
			  match[2] +
			  (match[3] ? '-' + match[3] + (match[4] ? '-' + match[4] : '') : '');
		e.target.value = value;
	};
	return (
		<div className="user-form" id="user-form-modal">
			<div className="form-container">
				<img
					className="bg"
					src={smallScreen ? customerFormBgMobile : customerFormBg}
					alt="bg"
				/>
				<div className="form-wrapper">
					<div className="title">Подтверждение покупки</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="form-group">
							<input
								type="text"
								placeholder="Ваше имя*"
								{...register('customer.name', {
									required: 'Введите имя!',
									pattern: {
										value: /^[a-zA-Zа-яА-ЯёЁ ]+$/,
										message: 'Введите имя правильно!',
									},
									onChange: (e) => handleNameChange(e),
								})}
							/>
							<p className={errors.customer?.name ? 'has-error' : 'warning'}>
								{errors.customer?.name?.message}
							</p>
						</div>
						<div className="form-group">
							<input
								type="phone"
								placeholder="Ваш номер телефона*"
								{...register('customer.phone', {
									required: 'Введите номер телефона!',
									pattern: {
										value: /^\+998 \([0-9]{2}\) [0-9]{3}-[0-9]{2}-[0-9]{2}/,
										message: 'Введите номер телефона правильно!',
									},
									onChange: (e) => handlePhoneChange(e),
								})}
							/>
							<p className={errors.customer?.phone ? 'has-error' : 'warning'}>
								{errors.customer?.phone
									? errors.customer?.phone?.message
									: 'Обязательно проверяйте ваш номер телефона перед отправкой'}
							</p>
						</div>
						<div className="form-group">
							<input
								type="phone"
								placeholder="Адрес*"
								{...register('customer.address', {
									required: 'Введите адрес!',
								})}
							/>
							<p className={errors.customer?.address ? 'has-error' : 'warning'}>
								{errors.customer?.address
									? errors.customer?.address?.message
									: 'Доставка осуществляется только в пределах г. Ташкента'}
							</p>
						</div>
						<div className="form-group">
							<button className="submit" type="submit">
								<img
									src={
										Object.keys(errors).length > 0
											? sendCustomerFormButtonInvalid
											: sendCustomerFormButton
									}
									alt="send"
									className="button-bg"
								/>
								<span>Отправить</span>
							</button>
							<p>
								Оплата производится через Payme, после оплаты с Вами свяжется курьер
							</p>
						</div>
					</form>
					<img
						src={closeFormButton}
						alt="close form"
						id="close-user-form-button"
						onClick={() => setIsUserFormOpen(false)}
					/>
					<PaymeForm myref={paymeFormRef} data={paymeData} />
				</div>
			</div>
		</div>
	);
};

const PaymeForm = ({ myref, data }) => {
	return (
		<form
			ref={myref}
			action="https://checkout.paycom.uz"
			method="POST"
			id="payme_form"
		>
			<input type="hidden" name="account[DiCafe]" value={data.order_id} />
			<input type="hidden" name="account[userPhone]" value={data.customer.phone} />
			<input type="hidden" name="account[userName]" value={data.customer.name} />
			<input
				type="hidden"
				name="account[userAddress]"
				value={data.customer.address}
			/>
			<input type="hidden" name="amount" value={data.amount} />
			<input type="hidden" name="merchant" value="61681fff6e71f7f8df534653" />
			<input type="hidden" name="lang" value="ru" />
			<input type="hidden" name="callback" value="https://dicafe.uz/" />
			<input type="hidden" name="detail" value={data.detail} />
		</form>
	);
};
